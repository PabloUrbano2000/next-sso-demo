import Image from 'next/image'

export const Header = () => {
  return (
    <header className='header'>
      <div className='max-w-10/12 m-auto flex items-center h-full'>
        <a href='https://elcomercio.pe/' target='_blank'>
          <Image
            src='/static/logo/elcomercio.svg'
            alt='El Comercio logo'
            width={219}
            height={36}
            priority
            loading='eager'
          />
        </a>
      </div>
    </header>
  )
}
