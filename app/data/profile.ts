import type { Profile } from '~/types'

export const profile: Profile = {
  name: 'Nguyễn Văn A',
  nickname: 'devA',
  tagline: 'Code is my craft, bugs are my teachers.',
  bio: 'Một lập trình viên đam mê xây dựng sản phẩm đẹp, đơn giản và hữu ích. Yêu thích open source, thích học hỏi công nghệ mới và chia sẻ kiến thức qua blog.',
  avatar: 'https://i.pravatar.cc/300?u=portfolio',
  email: 'hello@deva.dev',
  startDate: '2020-01-01',
  socials: [
    { name: 'GitHub', url: 'https://github.com', icon: 'simple-icons:github' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'simple-icons:twitter' },
    { name: 'RSS', url: '/feed', icon: 'simple-icons:rss' },
    { name: 'Email', url: 'mailto:hello@deva.dev', icon: 'lucide:mail' },
  ],
}
