import type { Project } from '~/types'

export const projects: Project[] = [
  {
    id: '1',
    name: 'RSSHub',
    description: 'Một nền tảng đồng bộ hóa nội dung RSS mã nguồn m, hỗ trợ hàng nghìn trang web khác nhau.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d7f2f5a8?w=800&q=80',
    url: 'https://github.com',
    tags: ['Node.js', 'RSS'],
  },
  {
    id: '2',
    name: 'xLog',
    description: 'Một cộng đồng sáng tạo mã nguồn mở được xây dựng trên blockchain, dành cho người viết blog.',
    image: 'https://images.unsplash.com/photo-1633356122544-f1340f3c0d9c?w=800&q=80',
    url: 'https://github.com',
    tags: ['Next.js', 'Blockchain'],
  },
  {
    id: '3',
    name: 'DPlayer',
    description: 'Trình phát video HTML5 đẹp mắt với h trợ danmaku, dễ dàng tích hợp vào bất kỳ trang web nào.',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=800&q=80',
    url: 'https://github.com',
    tags: ['JavaScript', 'Video'],
  },
  {
    id: '4',
    name: 'APlayer',
    description: 'Trình phát nhạc HTML5 nhẹ nhàng, hỗ trợ playlist và giao diện tùy chỉnh linh hoạt.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2df?w=800&q=80',
    url: 'https://github.com',
    tags: ['JavaScript', 'Audio'],
  },
]
