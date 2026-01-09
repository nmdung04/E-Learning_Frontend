import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { UserProfilePage } from '../modules/user/UserProfilePage'

function Layout({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <Outlet />
      <Footer />
    </>
  )
}

function HomePage({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean; setIsLoggedIn: (val: boolean) => void }) {
  return (
    <div className="main w-full h-80 flex flex-col items-center justify-center mt-20 mb-20">
      <p className="text-mint-50 py-4">Click the button to test the Login State (isLoggedIn or not)</p>
      <Button variant="primary" className='w-[30%] mx-auto' onClick={() => setIsLoggedIn(!isLoggedIn)}>Check!</Button>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Routes>
      <Route element={<Layout isLoggedIn={isLoggedIn} />}>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
