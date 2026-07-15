import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/golmok";
import { useTasteStore } from "../../store/useTasteStore";
import type { SearchScope } from "../../store/useTasteStore";
import type { Region } from "../../types/restaurant";

type NeighborhoodSelectorProps = {
  onSelect: (scope: SearchScope) => void;
};

type ReverseGeocodeResult = {
  display_name?: string;
  address?: Record<string, string>;
};

const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 5 * 60 * 1000,
    });
  });

const includesPlaceName = (address: string, placeName: string) =>
  address.replace(/\s+/g, "").includes(placeName.replace(/\s+/g, ""));

export function NeighborhoodSelector({ onSelect }: NeighborhoodSelectorProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const regions = useTasteStore((state) => state.regions);
  const setRegions = useTasteStore((state) => state.setRegions);

  useEffect(() => {
    let active = true;

    api
      .regions()
      .then(({ regions: nextRegions }) => {
        if (!active) return;
        setRegions(nextRegions);
        setLoadFailed(false);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setRegions]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return regions.slice(0, 6);
    return regions
      .filter(({ city, district, neighborhood }) =>
        `${city} ${district ?? ""} ${neighborhood}`.includes(trimmed),
      )
      .slice(0, 6);
  }, [query, regions]);
  const pick = (option: Region) =>
    onSelect({
      city: option.city,
      district: option.district,
      neighborhood: option.neighborhood,
      storeCount: option.storeCount,
    });

  const locateCurrentRegion = async () => {
    if (!("geolocation" in navigator)) {
      setLocationError("이 브라우저에서는 현재 위치를 확인할 수 없어요.");
      return;
    }

    setLocating(true);
    setLocationError("");

    try {
      const { coords } = await getCurrentPosition();
      const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(coords.latitude),
        lon: String(coords.longitude),
        zoom: "18",
        addressdetails: "1",
        "accept-language": "ko",
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");

      const result = (await response.json()) as ReverseGeocodeResult;
      const address = [
        result.display_name,
        ...Object.values(result.address ?? {}),
      ]
        .filter(Boolean)
        .join(" ");
      const currentRegion = regions.find(
        (region) =>
          region.available &&
          includesPlaceName(address, region.city) &&
          (!region.district || includesPlaceName(address, region.district)) &&
          includesPlaceName(address, region.neighborhood),
      );

      if (!currentRegion) {
        setLocationError("현재 위치는 아직 서비스하는 동네가 아니에요.");
        return;
      }

      pick(currentRegion);
    } catch {
      setLocationError("위치 권한을 허용한 뒤 다시 시도해주세요.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <Page>
      <Content>
        <Brand $delay={0}>골목결</Brand>
        <Heading $delay={80}>
          후기 많은 곳만 <br />
          반복하지 않아요.
        </Heading>
        <Lede $delay={160}>
          우리 동네의 다양한 식당을 <br />
          오늘의 취향으로 만나보세요.
        </Lede>

        <SearchWrap $delay={240}>
          <SearchField $focused={focused}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="동 이름을 입력하세요"
              aria-label="전국 읍면동 검색"
            />
          </SearchField>
        </SearchWrap>

        <FrequentNeighborhoods $delay={320}>
          <h2>{query.trim() ? "검색 결과" : "추천 동네"}</h2>
          {results.length ? (
            <NeighborhoodGrid>
              {results.map((option, index) => (
                <button
                  key={`${option.city}-${option.district}-${option.neighborhood}-${index}`}
                  onClick={() => pick(option)}
                  disabled={!option.available}
                >
                  <NeighborhoodName>{option.neighborhood}</NeighborhoodName>
                  <span>{option.storeCount}곳</span>
                  <small>
                    {[option.city, option.district].filter(Boolean).join(" · ")}
                  </small>
                </button>
              ))}
            </NeighborhoodGrid>
          ) : (
            <NeighborhoodEmpty>
              {loading
                ? "서비스 동네를 불러오고 있어요."
                : loadFailed
                  ? "동네 목록을 불러오지 못했어요."
                  : "그 이름의 동네는 아직 없어요."}
            </NeighborhoodEmpty>
          )}
        </FrequentNeighborhoods>

        <NearbyButton
          $delay={520}
          onClick={() => void locateCurrentRegion()}
          disabled={loading || locating || !regions.some((region) => region.available)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {locating ? "위치 확인 중..." : "내 위치 둘러보기"}
        </NearbyButton>
        {locationError && <LocationStatus role="status">{locationError}</LocationStatus>}
      </Content>
    </Page>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
`;

const Page = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--ink);
`;

const Content = styled.div`
  width: 100%;
  max-width: 760px;
  padding: 88px 24px;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    padding-top: 72px;
  }
  @media (max-width: 640px) {
    padding: 56px 18px 40px;
  }
`;

const enter = (delay: number) => css`
  opacity: 0;
  animation: ${fadeUp} 460ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards;
`;

const Brand = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-align: center;
`;

const Heading = styled.h1<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 48px 0 0;
  padding: 20px;
  font-size: 46px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.02em;
  text-align: center;

  @media (max-width: 640px) {
    margin-top: 36px;
    font-size: 38px;
  }
`;

const Lede = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 14px 0 0;
  color: var(--sub);
  font-size: 20px;
  line-height: 1.7;
  letter-spacing: -0.01em;
  text-align: center;
`;

const SearchWrap = styled.div<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 52px;
  @media (max-width: 640px) {
    margin-top: 36px;
  }
`;

const SearchField = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 72px;
  padding: 0 28px;
  border: 1px solid
    ${({ $focused }) => ($focused ? "var(--accent)" : "var(--line)")};
  border-radius: 999px;
  color: var(--muted);
  background: var(--card);
  transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  > svg {
    flex: none;
    width: 26px;
    height: 26px;
  }
  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    color: var(--ink);
    background: transparent;
    font-size: 20px;
    letter-spacing: -0.01em;
  }
  input::placeholder {
    color: var(--muted);
    opacity: 1;
  }
`;

const FrequentNeighborhoods = styled.section<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 28px;
  h2 {
    margin: 0;
    color: var(--sub);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
  }
`;

const NeighborhoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;

  button {
    position: relative;
    height: 104px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    min-width: 0;
    padding: 0 22px;
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--muted);
    background: var(--card);
    cursor: pointer;
    text-align: left;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  button:hover {
    border-color: #3a3733;
    background: var(--quote);
    transform: translateY(-1px);
  }
  button:active {
    transform: scale(0.98);
  }
  button > span:not(:first-of-type) {
    color: var(--muted);
    font-size: 15px;
  }
  small {
    position: absolute;
    right: 12px;
    bottom: 9px;
    max-width: calc(100% - 24px);
    overflow: hidden;
    color: var(--muted);
    font-size: 12px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const NeighborhoodName = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: var(--ink);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NeighborhoodEmpty = styled.p`
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 15px;
  text-align: center;
`;

const NearbyButton = styled.button<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  width: 100%;
  height: 68px;
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--sub);
  background: transparent;
  cursor: pointer;
  font-size: 19px;
  letter-spacing: -0.01em;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

  > svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: #3a3733;
    color: var(--ink);
    background: var(--quote);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const LocationStatus = styled.p`
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 14px;
  text-align: center;
`;
