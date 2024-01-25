interface Props {
  title?: string
  description?: string
  author?: string
  image?: string
  keyword?: string
  asPath?: string
}

const Meta = ({
  title = 'eBallan.com',
  description = `
    eBallan is an online booking system for flights.
  `,
  image: outsideImage = 'https://eballan.com/logo.png',
  asPath = '/',
  author = 'Ahmed Ibrahim',
  keyword = 'eBallan,flight booking,flight reservation',
}: Props) => {
  const url = `https://eballan.com${asPath}`
  const image = outsideImage ? outsideImage : `https://eballan.com/logo.png`

  return {
    title: title ? title : title,
    description: description ? description : description,
    image: image,

    metadataBase: new URL('https://eballan.com'),
    alternates: {
      canonical: url,
      languages: {
        'en-US': '/en-US',
      },
    },
    openGraph: {
      type: 'website',
      images: image,
      title: title ? title : title,
      description: description ? description : description,
    },
    keywords: [
      `${keyword} eballan,eballan.com, https://eballan.com, , next.js, next-ts, typescript, next-typescript, e-ballan, eBallan`,
    ],
    authors: [
      {
        name: author ? author : author,
        url: 'https://eballan.com',
      },
    ],
    publisher: author ? author : author,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icon: '/logo.png',
    twitter: {
      card: 'summary_large_image',
      title: title ? title : title,
      description: description ? description : description,
      // siteId: '1467726470533754880',
      // creatorId: '1467726470533754880',
      creator: `@${author ? author : author}`,
      images: {
        url: image,
        alt: title ? title : title,
      },
      app: {
        name: 'twitter_app',
        id: {
          iphone: 'twitter_app://iphone',
          ipad: 'twitter_app://ipad',
          googleplay: 'twitter_app://googleplay',
        },
        url: {
          iphone: image,
          ipad: image,
        },
      },
    },
    appleWebApp: {
      title: title ? title : title,
      statusBarStyle: 'black-translucent',
      startupImage: [
        '/logo.png',
        {
          url: '/logo.png',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    verification: {
      google: 'google',
      yandex: 'yandex',
      yahoo: 'yahoo',
      other: {
        me: ['info@eballan.com', 'http://eballan.com'],
      },
    },
  }
}
export default Meta
