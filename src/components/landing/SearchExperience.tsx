import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SearchScope } from '../../store/useTasteStore'

type SearchExperienceProps = {
  scope: SearchScope
  onChangeNeighborhood: () => void
  onSearch: (query: string) => void
}

type Reask = {
  query: string
  headline: string
  subline: string
  placeholder: string
  options: string[]
  showAll?: boolean
}

const examples = ['혼자 조용히', '친구랑 수다', '후딱 한 끼', '오래 앉아있기']
const cuisines = ['닭갈비', '삼겹살', '국밥', '파스타', '초밥', '냉면', '피자', '치킨', '쌀국수', '곱창', '김밥', '라멘', '돈까스', '막창', '갈비', '보쌈']
const genericWords = ['맛집', '추천', '근처', '유명', '인기', '베스트', 'best']

export function SearchExperience({ scope, onChangeNeighborhood, onSearch }: SearchExperienceProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [reask, setReask] = useState<Reask | null>(null)

  const routeQuery = (raw: string) => {
    const nextQuery = raw.trim()
    if (!nextQuery) return
    const cuisine = cuisines.find((item) => nextQuery.includes(item))
    if (cuisine) {
      setReask({
        query: nextQuery,
        headline: `${scope.neighborhood}에 ${cuisine}집이\n8곳 있어요.`,
        subline: '그런데 다 다른 집이에요.\n어떤 자리를 찾으세요?',
        placeholder: `예: “회식용 ${cuisine}집”`,
        options: ['혼자 조용히', '여럿이 왁자지껄', '가성비 좋게', '분위기 있게'],
        showAll: true,
      })
      return
    }
    if (genericWords.some((word) => nextQuery.toLowerCase().includes(word.toLowerCase()))) {
      setReask({
        query: nextQuery,
        headline: '맛있는 집은\n네이버가 더 잘 알아요.',
        subline: '저희는 다른 걸 알려드릴게요.\n어떤 자리를 원하세요?',
        placeholder: '예: 비 오는 날 혼자 앉기 좋은 곳',
        options: ['혼자 조용히', '친구랑 수다', '후딱 한 끼', '오래 앉아있기', '가성비 좋게', '특별한 날'],
      })
      return
    }
    onSearch(nextQuery)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    routeQuery(query)
  }

  return (
    <Page>
      <Topbar>
        <Wordmark>골목결</Wordmark>
        <div>
          <span>{scope.neighborhood} · 식당 187곳</span>
          <button onClick={onChangeNeighborhood}>바꾸기</button>
        </div>
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
            <p>{reask.subline}</p>
            <ReaskGrid>
              {reask.options.map((option, index) => <ReaskOption key={option} $tone={index % 4} onClick={() => onSearch(option)}>{option}</ReaskOption>)}
            </ReaskGrid>
            <ReaskDirectLabel>또는 직접 말해보세요</ReaskDirectLabel>
            <ReaskInput $focused={focused} onSubmit={submit}>
              <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={reask.placeholder} />
            </ReaskInput>
            {reask.showAll && <ShowAllButton onClick={() => onSearch(reask.query)}>8곳 그냥 다 보기</ShowAllButton>}
          </ReaskView>
        ) : (
          <SearchView>
            <SearchHeading $delay={0}>오늘은 어떤 자리에<br />앉고 싶어요?</SearchHeading>
            <SearchLede $delay={80}>편하게 말해보세요.<br />골목이 다시 그려질 거예요.</SearchLede>
            <QueryForm $delay={160} onSubmit={submit}>
              <SearchField $focused={focused}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="혼자 조용히 밥 먹고 싶어" />
                <SubmitButton type="submit" $ready={Boolean(query.trim())} aria-label="찾기">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </SubmitButton>
              </SearchField>
            </QueryForm>
            <ExampleGrid $delay={240}>
              {examples.map((example) => <button key={example} onClick={() => onSearch(example)}>{example}</button>)}
            </ExampleGrid>
          </SearchView>
        )}
      </Stage>
    </Page>
  )
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
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
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(13, 12, 11, .72);
  backdrop-filter: blur(8px);

  > div { display: flex; align-items: center; gap: 16px; }
  > div > span { color: var(--sub); font-size: 13px; letter-spacing: -.01em; }
  button { height: 28px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; color: var(--sub); background: transparent; cursor: pointer; font-size: 13px; }
  button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }

  @media (max-width: 640px) {
    padding: 0 16px;
    > div { gap: 9px; }
    > div > span { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
`

const Wordmark = styled.span`
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .18em;
`

const Stage = styled.div`
  display: flex;
  justify-content: center;
`

const SearchView = styled.section`
  width: 100%;
  max-width: 720px;
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
  font-size: 40px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -.02em;
  @media (max-width: 640px) { font-size: 34px; }
`

const SearchLede = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 22px 0 0;
  color: var(--sub);
  font-size: 18px;
  line-height: 1.7;
  letter-spacing: -.01em;
`

const QueryForm = styled.form<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 46px;
`

const SearchField = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 68px;
  padding: 0 12px 0 24px;
  border: 1px solid ${({ $focused }) => $focused ? 'var(--accent)' : 'var(--line)'};
  border-radius: 999px;
  color: var(--muted);
  background: var(--card);
  transition: border-color 150ms cubic-bezier(.4, 0, .2, 1);

  > svg { flex: none; width: 24px; height: 24px; }
  input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 18px; letter-spacing: -.01em; }
  input::placeholder { color: var(--muted); opacity: 1; }
`

const SubmitButton = styled.button<{ $ready: boolean }>`
  flex: none;
  width: 48px;
  height: 48px;
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
  gap: 12px;
  margin-top: 20px;

  button { height: 58px; display: flex; align-items: center; padding: 0 20px; border: 1px solid var(--line); border-radius: 10px; color: var(--sub); background: var(--card); cursor: pointer; font-size: 16px; letter-spacing: -.01em; text-align: left; transition: all 150ms cubic-bezier(.4, 0, .2, 1); }
  button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const ReaskView = styled.section`
  ${enter()}
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  padding: 96px 24px;

  > h1 { margin: 32px 0 0; color: var(--ink); font-size: 28px; font-weight: 500; line-height: 1.35; letter-spacing: -.02em; white-space: pre-line; }
  > p { margin: 20px 0 0; color: var(--sub); font-size: 15px; line-height: 1.7; letter-spacing: -.01em; white-space: pre-line; }
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
  font-size: 20px;
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
  height: 96px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--ink);
  background: var(--card);
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -.01em;
  transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  &:hover { border-color: ${({ $tone }) => optionColors[$tone]}; color: ${({ $tone }) => optionColors[$tone]}; background: var(--quote); }
`

const ReaskDirectLabel = styled.span`
  margin-top: 32px;
  color: var(--muted);
  font-size: 13px;
`

const ReaskInput = styled.form<{ $focused: boolean }>`
  height: 52px;
  margin-top: 12px;
  padding: 0 20px;
  border: 1px solid ${({ $focused }) => $focused ? 'var(--accent)' : 'var(--line)'};
  border-radius: 999px;
  background: var(--card);
  input { width: 100%; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 15px; }
`

const ShowAllButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 32px;
  border: 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  &:hover { color: var(--sub); }
`
