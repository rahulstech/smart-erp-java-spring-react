import { Routes, Route } from 'react-router-dom'
import CompanySelectionPage from './company/pages/CompanySelectionPage'
import CreateCompanyPage from './company/pages/CreateCompanyPage'
import NotificationHost from './common/components/NotificationHost'


export default function App() {
  return (
    <NotificationHost>
      <div className="min-h-screen bg-white text-black antialiased font-sans">
        <Routes>
          <Route path="/" element={<CompanySelectionPage />} />
          <Route path="/create-company" element={<CreateCompanyPage />} />
        </Routes>
      </div>
    </NotificationHost>
  )
}

