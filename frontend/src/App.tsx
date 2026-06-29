import { Routes, Route } from 'react-router-dom'
import CompanyListPage from './company/pages/CompanyListPage'
import CreateCompanyPage from './company/pages/CreateCompanyPage'
import EditCompanyPage from './company/pages/EditCompanyPage'
import CompanyDashboardPage from './company/pages/CompanyDashboardPage'
import CreateCustomerPage from './customer/pages/CreateCustomerPage'
import EditCustomerPage from './customer/pages/EditCustomerPage'
import CustomerListPage from './customer/pages/CustomerListPage'
import NotificationHost from './common/components/NotificationHost'
import ShortcutProvider from './common/components/ShortcutProvider'
import { APP_ROUTES } from './common/constants'

export default function App() {
  return (
    <NotificationHost>
      <ShortcutProvider>
        <div className="min-h-screen bg-white text-black antialiased font-sans">
          <Routes>
            <Route path={APP_ROUTES.HOME.path} element={<CompanyListPage />} />
            <Route path={APP_ROUTES.COMPANY_SELECTION.path} element={<CompanyListPage />} />
            <Route path={APP_ROUTES.CREATE_COMPANY.path} element={<CreateCompanyPage />} />
            <Route path={APP_ROUTES.EDIT_COMPANY.path} element={<EditCompanyPage />} />
            <Route path={APP_ROUTES.DASHBOARD.path} element={<CompanyDashboardPage />} />
            <Route path={APP_ROUTES.CREATE_CUSTOMER.path} element={<CreateCustomerPage />} />
            <Route path={APP_ROUTES.EDIT_CUSTOMER.path} element={<EditCustomerPage />} />
            <Route path={APP_ROUTES.CUSTOMER_LIST.path} element={<CustomerListPage />} />
          </Routes>
        </div>
      </ShortcutProvider>
    </NotificationHost>
  )
}

