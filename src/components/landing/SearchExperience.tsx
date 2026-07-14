import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { SearchScope } from '../../store/useTasteStore'
import type { Reask, SearchResponse } from '../../types/restaurant'
import { getSearchQueryError } from '../../utils/searchIntent'

type SearchExperienceProps = {
  scope: SearchScope
  onChangeNeighborhood: () => void
  onSearch: (query: string, force?: boolean) => Promise<SearchResponse>
}

type SearchError = {
  title: string
  message: string
}

const examples = ['혼자 조용히', '친구랑 수다', '후딱 한 끼', '오래 앉아있기']

export function SearchExperience({ scope, onChangeNeighborhood, onSearch }: SearchExperienceProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [reask, setReask] = useState<Reask | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingQuery, setLoadingQuery] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState<SearchError | null>(null)

  useEffect(() => {
    if (!loading) {
      setElapsedSeconds(0)
      return
    }

    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 500)
    return () => window.clearInterval(timer)
  }, [loading])

  const runSearch = async (raw: string, force = false) => {
    const nextQuery = raw.trim()
    if (!nextQuery || loading) return

    const queryError = getSearchQueryError(nextQuery)
    if (queryError) {
      setError({ title: '입력 내용을 확인해주세요', message: queryError })
      return
    }

    setLoadingQuery(nextQuery)
    setLoading(true)
    setError(null)
    try {
      const response = await onSearch(nextQuery, force)
      if (response.type === 'reask') {
        setReask(response.reask)
        setQuery('')
      }
    } catch {
      setError({
        title: '검색 중 문제가 생겼어요',
        message: '검색 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      })
    } finally {
      setLoading(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void runSearch(query)
  }

  return (
    <Page aria-busy={loading}>
      <Topbar>
        <TopbarLeading>
          <BackButton type="button" onClick={onChangeNeighborhood} aria-label="동네 선택으로 돌아가기">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            뒤로
          </BackButton>
          <Wordmark>골목결</Wordmark>
        </TopbarLeading>
        <TopbarContext>
          <span>{scope.neighborhood} · 식당 {scope.storeCount}곳</span>
          <button type="button" onClick={onChangeNeighborhood}>바꾸기</button>
        </TopbarContext>
      </Topbar>

      <Stage>
        {reask ? (
          <ReaskView>
            <ReaskQuery onClick={() => setReask(null)} aria-label="검색 화면으로 돌아가기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
              “{reask.query}”
            </ReaskQuery>
            <ReaskDivider />
            <h1>{reask.headline}</h1>
            <p>{loading ? '골목을 다시 그리는 중이에요.\n잠시만 기다려주세요.' : reask.subline}</p>
            <ReaskGrid>
              {reask.options.map((option, index) => (
                <ReaskOption
                  key={option}
                  $tone={index % 4}
                  onClick={() => void runSearch(`${reask.query} ${option}`)}
                  disabled={loading}
                >
                  {option}
                </ReaskOption>
              ))}
            </ReaskGrid>
            <ReaskDirectLabel>또는 직접 말해보세요</ReaskDirectLabel>
            <ReaskInput $focused={focused} $invalid={Boolean(error)} onSubmit={submit}>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setError(null) }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={reask.placeholder} disabled={loading} aria-invalid={Boolean(error)} />
            </ReaskInput>
            {error && <ErrorNotice error={error} />}
            {reask.showAll && <ShowAllButton onClick={() => void runSearch(reask.query, true)} disabled={loading}>그냥 다 보기</ShowAllButton>}
          </ReaskView>
        ) : (
          <SearchView>
            <SearchHeading $delay={0}>오늘은 어떤 자리에<br />앉고 싶어요?</SearchHeading>
            <SearchLede $delay={80}>
              {loading ? '골목을 다시 그리는 중이에요. 잠시만 기다려주세요.' : <>편하게 말해보세요.<br />골목이 다시 그려질 거예요.</>}
            </SearchLede>
            <QueryForm $delay={160} onSubmit={submit}>
              <SearchField $focused={focused} $invalid={Boolean(error)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={query} onChange={(event) => { setQuery(event.target.value); setError(null) }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="혼자 조용히 밥 먹고 싶어" disabled={loading} aria-invalid={Boolean(error)} />
                <SubmitButton type="submit" $ready={Boolean(query.trim()) && !loading} aria-label="찾기" disabled={loading}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </SubmitButton>
              </SearchField>
            </QueryForm>
            {error && <ErrorNotice error={error} />}
            <ExampleGrid $delay={240}>
              {examples.map((example) => <button key={example} onClick={() => void runSearch(example)} disabled={loading}>{example}</button>)}
            </ExampleGrid>
          </SearchView>
        )}
      </Stage>
      {loading && (
        <SearchLoading role="status" aria-live="polite" aria-label="식당 검색 중">
          <LoadingCard>
            <LoadingOrbit aria-hidden="true"><i /><i /><i /></LoadingOrbit>
            <strong>{scope.neighborhood}의 골목을 찾고 있어요</strong>
            <LoadingQuery>“{loadingQuery}”</LoadingQuery>
            <LoadingStatus>
              {elapsedSeconds < 3
                ? '골목 데이터를 확인하는 중이에요.'
                : elapsedSeconds < 7
                  ? '취향 기준을 정리하는 중이에요.'
                  : '추천 지도를 완성하는 중이에요.'}
            </LoadingStatus>
            <LoadingTrack aria-hidden="true"><i /></LoadingTrack>
            <LoadingTime aria-hidden="true">{elapsedSeconds}초 · 검색이 끝나면 자동으로 지도로 이동해요.</LoadingTime>
          </LoadingCard>
        </SearchLoading>
      )}
    </Page>
  )
}

function ErrorNotice({ error }: { error: SearchError }) {
  return (
    <ErrorCard role="alert" aria-live="assertive">
      <ErrorIcon aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5" />
          <circle cx="12" cy="16.5" r=".75" fill="currentColor" stroke="none" />
        </svg>
      </ErrorIcon>
      <div>
        <strong>{error.title}</strong>
        <span>{error.message}</span>
      </div>
    </ErrorCard>
  )
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
`

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const loadingSweep = keyframes`
  0% { transform: translateX(-100%); }
  55%, 100% { transform: translateX(280%); }
`

const errorIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
`

const enter = (delay = 0) => css`
  opacity: 0;
  animation: ${fadeUp} 460ms cubic-bezier(.4, 0, .2, 1) ${delay}ms forwards;
`

const Page = styled.main`
  min-height: 100dvh;
  color: var(--ink);
  background: transparent;
`

const Topbar = styled.header`
  position: relative;
  z-index: 2;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(13, 12, 11, .72);
  backdrop-filter: blur(8px);

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`

const TopbarLeading = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 8px;
  color: var(--sub);
  background: transparent;
  cursor: pointer;
  font-size: 14px;

  svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  &:hover { color: var(--ink); background: var(--quote); }
`

const TopbarContext = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  > span { color: var(--sub); font-size: 14px; letter-spacing: -.01em; }
  > button { height: 32px; padding: 0 14px; border: 1px solid var(--line); border-radius: 8px; color: var(--sub); background: transparent; cursor: pointer; font-size: 14px; }
  > button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }

  @media (max-width: 640px) {
    gap: 9px;
    > span { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
`

const Wordmark = styled.span`
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: .18em;

  @media (max-width: 640px) { display: none; }
`

const Stage = styled.div`
  display: flex;
  justify-content: center;
`

const SearchView = styled.section`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  padding: 108px 24px 96px;

  @media (max-width: 900px) { padding-top: 88px; }
  @media (max-width: 640px) { padding: 64px 18px 48px; }
`

const SearchHeading = styled.h1<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 0;
  color: var(--ink);
  font-size: 46px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -.02em;
  @media (max-width: 640px) { font-size: 38px; }
`

const SearchLede = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 22px 0 0;
  color: var(--sub);
  font-size: 20px;
  line-height: 1.7;
  letter-spacing: -.01em;
`

const QueryForm = styled.form<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 46px;
`

const SearchField = styled.div<{ $focused: boolean; $invalid: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 76px;
  padding: 0 13px 0 28px;
  border: 1px solid ${({ $focused, $invalid }) => $invalid ? 'var(--orange)' : $focused ? 'var(--accent)' : 'var(--line)'};
  border-radius: 999px;
  color: var(--muted);
  background: var(--card);
  transition: border-color 150ms cubic-bezier(.4, 0, .2, 1);

  > svg { flex: none; width: 26px; height: 26px; }
  input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 20px; letter-spacing: -.01em; }
  input::placeholder { color: var(--muted); opacity: 1; }
`

const SubmitButton = styled.button<{ $ready: boolean }>`
  flex: none;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: ${({ $ready }) => $ready ? 'var(--background)' : 'var(--muted)'};
  background: ${({ $ready }) => $ready ? 'var(--accent)' : 'var(--quote)'};
  cursor: pointer;
  transition: all 150ms cubic-bezier(.4, 0, .2, 1);
`

const ExampleGrid = styled.div<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 22px;

  button { height: 68px; display: flex; align-items: center; padding: 0 24px; border: 1px solid var(--line); border-radius: 10px; color: var(--sub); background: var(--card); cursor: pointer; font-size: 18px; letter-spacing: -.01em; text-align: left; transition: all 150ms cubic-bezier(.4, 0, .2, 1); }
  button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const ReaskView = styled.section`
  ${enter()}
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  padding: 96px 24px;

  > h1 { margin: 32px 0 0; color: var(--ink); font-size: 32px; font-weight: 500; line-height: 1.35; letter-spacing: -.02em; white-space: pre-line; }
  > p { margin: 20px 0 0; color: var(--sub); font-size: 17px; line-height: 1.7; letter-spacing: -.01em; white-space: pre-line; }
  @media (max-width: 640px) { padding: 64px 18px 48px; }
`

const ReaskQuery = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  color: var(--sub);
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -.01em;
  text-align: left;
`

const ReaskDivider = styled.div`
  height: 1px;
  margin-top: 24px;
  background: var(--line);
`

const ReaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 40px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const optionColors = ['var(--violet)', 'var(--orange)', 'var(--green)', 'var(--pink)']

const ReaskOption = styled.button<{ $tone: number }>`
  height: 108px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--ink);
  background: var(--card);
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -.01em;
  transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  &:hover { border-color: ${({ $tone }) => optionColors[$tone]}; color: ${({ $tone }) => optionColors[$tone]}; background: var(--quote); }
`

const ReaskDirectLabel = styled.span`
  margin-top: 32px;
  color: var(--muted);
  font-size: 14px;
`

const ReaskInput = styled.form<{ $focused: boolean; $invalid: boolean }>`
  height: 60px;
  margin-top: 12px;
  padding: 0 22px;
  border: 1px solid ${({ $focused, $invalid }) => $invalid ? 'var(--orange)' : $focused ? 'var(--accent)' : 'var(--line)'};
  border-radius: 999px;
  background: var(--card);
  input { width: 100%; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 17px; }
`

const ErrorCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 14px;
  padding: 16px 18px;
  border: 1px solid rgba(245, 148, 110, .62);
  border-radius: 12px;
  color: var(--ink);
  background: rgba(245, 148, 110, .12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .16);
  animation: ${errorIn} 180ms cubic-bezier(.4, 0, .2, 1) both;

  > div { min-width: 0; }
  > div > strong { display: block; color: var(--orange); font-size: 16px; font-weight: 600; line-height: 1.4; }
  > div > span { display: block; margin-top: 4px; color: #d8d2ca; font-size: 15px; line-height: 1.55; word-break: keep-all; }

  @media (max-width: 640px) { padding: 14px 15px; }
`

const ErrorIcon = styled.span`
  flex: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--orange);
  background: rgba(245, 148, 110, .16);
`

const ShowAllButton = styled.button`
  width: 100%;
  height: 54px;
  margin-top: 32px;
  border: 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  &:hover { color: var(--sub); }
`

const SearchLoading = styled.div`
  position: fixed;
  z-index: 20;
  inset: 64px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(13, 12, 11, .88);
  backdrop-filter: blur(10px);
`

const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(440px, 100%);
  padding: 40px 32px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
  box-shadow: 0 24px 80px rgba(0, 0, 0, .28);
  text-align: center;

  > strong { margin-top: 24px; color: var(--ink); font-size: 21px; font-weight: 500; line-height: 1.4; }
`

const LoadingOrbit = styled.span`
  position: relative;
  display: block;
  width: 64px;
  height: 64px;
  animation: ${orbit} 1.8s linear infinite;

  i { position: absolute; width: 12px; height: 12px; border-radius: 50%; }
  i:nth-of-type(1) { top: 0; left: 26px; background: var(--orange); }
  i:nth-of-type(2) { right: 4px; bottom: 9px; background: var(--violet); }
  i:nth-of-type(3) { bottom: 9px; left: 4px; background: var(--green); }
`

const LoadingQuery = styled.p`
  max-width: 100%;
  margin: 12px 0 0;
  overflow: hidden;
  color: var(--sub);
  font-size: 15px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LoadingStatus = styled.p`margin: 24px 0 0; color: var(--ink); font-size: 14px; line-height: 1.5;`

const LoadingTrack = styled.span`
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--quote);

  i { display: block; width: 36%; height: 100%; border-radius: inherit; background: var(--accent); animation: ${loadingSweep} 1.5s ease-in-out infinite; }
`

const LoadingTime = styled.small`margin-top: 12px; color: var(--muted); font-size: 12px; line-height: 1.5;`
