import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

const POLL_INTERVAL = 50 * 1000 // 50s

const THREADS_FIELDS = `
  items {
    id
    title
    slug
    category {
      id
      name
      slug
      color
      icon
      parent {
        id
        name
        slug
        color
        icon
      }
    }
  }
  nextCursor
`

const THREADS_QUERY = gql`
  query Threads {
    threads {
      ${THREADS_FIELDS}
    }
  }
`

interface IThreadsData {
  threads: {
    items: Array<IThread>
    nextCursor: string | null
  }
}

interface IThread {
  id: string
  title: string
  slug: string
  category: IThreadCategory
}

interface IThreadCategory {
  id: string
  name: string
  slug: string
  color: string | null
  icon: string | null
  parent: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  }
}

export const useThreadsQuery = () => {
  return useQuery<IThreadsData>(THREADS_QUERY, {
    pollInterval: POLL_INTERVAL,
  })
}

interface ICategoryQueryParams {
  id: string
}

const CATEGORY_THREADS_QUERY = gql`
  query CategoryThreads($id: ID!) {
    category(id: $id) {
      id
      name
      slug
      parent {
        id
        name
        slug
      }
    }
    threads(category: $id) {
      ${THREADS_FIELDS}
    }
  }
`

interface ICategoryThreadsData {
  category: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
    parent: {
      id: string
      name: string
      slug: string
      color: string | null
      icon: string | null
    } | null
  }
  threads: {
    items: Array<IThread>
    nextCursor: string | null
  }
}

export const useCategoryThreadsQuery = (params: ICategoryQueryParams) => {
  return useQuery<ICategoryThreadsData, ICategoryQueryParams>(
    CATEGORY_THREADS_QUERY,
    {
      pollInterval: POLL_INTERVAL,
      variables: params,
    }
  )
}
