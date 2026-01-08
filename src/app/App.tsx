import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <Header 
      isLoggedIn={isLoggedIn} 
      />
      <div className="main w-full flex flex-col items-center justify-center mt-20 mb-20">

        <p className="text-mint-50 py-4">Click the button to test the Login State (isLoggedIn or not)</p>
        <Button variant="primary" className='w-[30%] mx-auto' onClick={() => setIsLoggedIn(!isLoggedIn)}>Check!</Button>
      </div>
      <Footer />
    </>
  )
}

export default App
