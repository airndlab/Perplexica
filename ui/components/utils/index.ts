import _ from 'lodash';
import { Discover } from '@/app/discover/page';

export const getCurrentDiscover = (query: string, blogs: Discover[]): Discover | undefined => {
  return _.startsWith(query, 'Сводка:')
    ? _.find(blogs, (blog: Discover) => {
      return blog.url.split('/').pop() === query.substring(query.indexOf(':') + 2)
    })
    : undefined;
};

export const fetchDataDiscover = async () => {
  const res = await fetch('/discover.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data = await res.json();

  if (!data.blogs) {
    data = {
      blogs: Object.values(data),
    }
  }

  if (!res.ok) {
    throw new Error(data.message);
  }

  data.blogs = data.blogs.filter((blog: Discover) => blog.thumbnail);

  return data.blogs;
};
