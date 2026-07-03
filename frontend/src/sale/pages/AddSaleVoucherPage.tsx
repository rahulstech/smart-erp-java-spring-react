import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateSaleVoucher } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { APP_ROUTES } from '../../common/constants';
import SaleVoucherInput from '../components/SaleVoucherInput';
import { SaleVoucherFormData } from '../types/sale.types';

export default function AddSaleVoucherPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();

  const createMutation = useCreateSaleVoucher(company_id || '');

  const [serverErrors, setServerErrors] = useState<{ customer?: string; voucherDate?: string } | undefined>(undefined);

  useEffect(() => {
    setTitle("New Sale Voucher");
    setOnRetry(undefined);
  }, [setTitle, setOnRetry]);

  const handleSave = useCallback((formData: SaleVoucherFormData) => {
    setServerErrors(undefined);

    createMutation.mutate({
      customerId: formData.customer!.id,
      voucherDate: formData.voucherDate
    }, {
      onSuccess: (data) => {
        showToast(`Sale voucher "${data.voucherNumber}" created successfully!`);
        if (APP_ROUTES.SALE_VOUCHER_ITEMS_LIST.create) {
          navigate(APP_ROUTES.SALE_VOUCHER_ITEMS_LIST.create(company_id, data.id));
        } else {
          navigate(-1);
        }
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data;
          if (data && typeof data.reasons === 'object' && data.reasons !== null) {
            setServerErrors(data.reasons as typeof serverErrors);
            showToast("Validation failed. Please check input fields.");
            return;
          }
        }
        showToast("Could not create the sale voucher due to an error.");
      }
    });
  }, [createMutation, company_id, navigate, showToast]);

  return (
    <>
      <SaleVoucherInput onSave={handleSave} serverErrors={serverErrors} />
      {createMutation.isPending && <LoadingPopup message="Creating sale voucher..." />}
    </>
  );
}
