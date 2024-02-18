import { useAsync } from 'react-use'

import { Result } from '@/types/template'
import { postData } from '@/utils/helpers'

export function useTemplates(pageSize: number) {
  return useAsync(async () => {
    const res = await postData({
      url: '/auth/templates_query',
      data: {
        pageSize: pageSize,
      },
    })
    return res.data as Result
  }, [pageSize])
}

export function usePost(id: string) {
  return useAsync(async () => {
    return await postData({
      url: '/auth/post_get',
      data: {
        id,
      },
    })
  }, [id])
}
