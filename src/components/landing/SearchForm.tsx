import { useState } from 'react'
import type { FormEvent } from 'react'

type SearchFormProps = {
  placeholder: string
  onSubmit: (query: string) => void
}

export function SearchForm({ placeholder, onSubmit }: SearchFormProps) {
  const [value, setValue] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(value.trim() || placeholder)
  }

  return (
    <form className="search-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="main-search">원하는 식당을 문장으로 검색</label>
      <input
        id="main-search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit">찾기</button>
    </form>
  )
}
