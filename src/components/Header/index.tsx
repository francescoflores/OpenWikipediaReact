import { ReactNode } from 'react'

const Header = ({level,children}:{level:number,children:ReactNode}
    ) => {
        switch (level) {
            case 2:
                return(<h2 className='font-bold text-2xl'>{children}</h2>)
            
            case 3:
                return(<h3 className='font-bold text-xl'>{children}</h3>)

            case 4:
                return(<h4 className='font-semibold text-lg'>{children}</h4>)
            
            default:
                return(<h5 className='font-semibold'>{children}</h5>)

        }
}

export default Header