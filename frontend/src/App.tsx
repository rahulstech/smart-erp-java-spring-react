import { Routes, Route } from 'react-router-dom'
import CompanyListPage from './company/pages/CompanyListPage'
import CreateCompanyPage from './company/pages/CreateCompanyPage'
import EditCompanyPage from './company/pages/EditCompanyPage'
import CompanyDashboardPage from './company/pages/CompanyDashboardPage'
import CreateCustomerPage from './customer/pages/CreateCustomerPage'
import EditCustomerPage from './customer/pages/EditCustomerPage'
import CustomerListPage from './customer/pages/CustomerListPage'
import CreateSupplierPage from './supplier/pages/CreateSupplierPage'
import EditSupplierPage from './supplier/pages/EditSupplierPage'
import SupplierListPage from './supplier/pages/SupplierListPage'
import StockListPage from './inventory/pages/StockListPage'
import CreateStockPage from './inventory/pages/CreateStockPage'
import AddCategoryPage from './inventory/pages/AddCategoryPage'
import AddUnitPage from './inventory/pages/AddUnitPage'
import NotificationHost from './common/components/NotificationHost'
import ShortcutProvider from './common/components/ShortcutProvider'
import Scaffold from './common/components/Scaffold'
import { ScaffoldProvider } from './common/context/ScaffoldContext'
import { APP_ROUTES } from './common/constants'

export default function App() {
  return (
    <NotificationHost>
      <ShortcutProvider>
        <ScaffoldProvider>
          <div className="min-h-screen bg-white text-black antialiased font-sans">
            <Routes>
              <Route element={<Scaffold />}>
                <Route path={APP_ROUTES.HOME.path} element={<CompanyListPage />} />
                <Route path={APP_ROUTES.COMPANY_LIST.path} element={<CompanyListPage />} />
                <Route path={APP_ROUTES.COMPANY_SELECTION.path} element={<CompanyListPage />} />

                <Route path={APP_ROUTES.CREATE_COMPANY.path} element={<CreateCompanyPage />} />
                <Route path={APP_ROUTES.EDIT_COMPANY.path} element={<EditCompanyPage />} />
                <Route path={APP_ROUTES.DASHBOARD.path} element={<CompanyDashboardPage />} />
                <Route path={APP_ROUTES.CREATE_CUSTOMER.path} element={<CreateCustomerPage />} />
                <Route path={APP_ROUTES.EDIT_CUSTOMER.path} element={<EditCustomerPage />} />
                <Route path={APP_ROUTES.CUSTOMER_LIST.path} element={<CustomerListPage />} />
                <Route path={APP_ROUTES.CREATE_SUPPLIER.path} element={<CreateSupplierPage />} />
                <Route path={APP_ROUTES.EDIT_SUPPLIER.path} element={<EditSupplierPage />} />
                <Route path={APP_ROUTES.SUPPLIER_LIST.path} element={<SupplierListPage />} />
                <Route path={APP_ROUTES.STOCK_LIST.path} element={<StockListPage />} />
                <Route path={APP_ROUTES.CREATE_STOCK.path} element={<CreateStockPage />} />
                <Route path={APP_ROUTES.EDIT_STOCK.path} element={<CreateStockPage />} />
                <Route path={APP_ROUTES.ADD_CATEGORY.path} element={<AddCategoryPage />} />
                <Route path={APP_ROUTES.ADD_UNIT.path} element={<AddUnitPage />} />
              </Route>
            </Routes>
          </div>
        </ScaffoldProvider>
      </ShortcutProvider>
    </NotificationHost>
  )
}
