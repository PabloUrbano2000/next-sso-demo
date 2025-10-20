import Image from 'next/image'

export const Header = () => {
  return (
    <header className='w-full py-1.5 bg-yellow-300 mb-11 h-16 justify-center items-center'>
      <div className='max-w-10/12 m-auto flex items-center h-full'>
        <Image
          src='/static/logo/elcomercio.svg'
          alt='El Comercio logo'
          width={218}
          height={35}
          priority
        />
      </div>
    </header>
  )
}
