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
import PurchaseVoucherListPage from './purchase/pages/PurchaseVoucherListPage'
import PurchaseVoucherItemsList from './purchase/pages/PurchaseVoucherItemsListPage'
import AddPurchaseVoucherPage from './purchase/pages/AddPurchaseVoucherPage'
import AddPurchaseItemPage from './purchase/pages/ManagePurchaseVoucherItemPage'
import EditPurchaseVoucherPage from './purchase/pages/EditPurchaseVoucherPage'
import SaleVoucherListPage from './sale/pages/SaleVoucherListPage'
import SaleVoucherItemsList from './sale/pages/SaleVoucherItemsListPage'
import AddSaleVoucherPage from './sale/pages/AddSaleVoucherPage'
import AddSaleItemPage from './sale/pages/ManageSaleVoucherItemPage'
import EditSaleVoucherPage from './sale/pages/EditSaleVoucherPage'
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

                <Route path={APP_ROUTES.PURCHASE_VOUCHER_LIST.path} element={<PurchaseVoucherListPage />} />
                <Route path={APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.path} element={<PurchaseVoucherItemsList />} />
                <Route path={APP_ROUTES.CREATE_PURCHASE_VOUCHER.path} element={<AddPurchaseVoucherPage />} />
                <Route path={APP_ROUTES.ADD_PURCHASE_ITEM.path} element={<AddPurchaseItemPage />} />
                <Route path={APP_ROUTES.EDIT_PURCHASE_VOUCHER.path} element={<EditPurchaseVoucherPage />} />

                <Route path={APP_ROUTES.SALE_VOUCHER_LIST.path} element={<SaleVoucherListPage />} />
                <Route path={APP_ROUTES.SALE_VOUCHER_ITEMS_LIST.path} element={<SaleVoucherItemsList />} />
                <Route path={APP_ROUTES.CREATE_SALE_VOUCHER.path} element={<AddSaleVoucherPage />} />
                <Route path={APP_ROUTES.ADD_SALE_ITEM.path} element={<AddSaleItemPage />} />
                <Route path={APP_ROUTES.EDIT_SALE_VOUCHER.path} element={<EditSaleVoucherPage />} />
              </Route>
            </Routes>
          </div>
        </ScaffoldProvider>
      </ShortcutProvider>
    </NotificationHost>
  )
}
