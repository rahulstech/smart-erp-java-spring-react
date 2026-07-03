import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreatePurchaseVoucher } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { APP_ROUTES } from '../../common/constants';
import PurchaseVoucherInput from '../components/PurchaseVoucherInput';
import { PurchaseVoucherFormData } from '../types/purchase.types';

export default function AddPurchaseVoucherPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();

  const createMutation = useCreatePurchaseVoucher(company_id || '');

  const [serverErrors, setServerErrors] = useState<{ supplier?: string; voucherDate?: string } | undefined>(undefined);

  useEffect(() => {
    setTitle("New Purchase Voucher");
    setOnRetry(undefined);
  }, [setTitle, setOnRetry]);

  const handleSave = useCallback((formData: PurchaseVoucherFormData) => {
    setServerErrors(undefined);

    createMutation.mutate({
      supplierId: formData.supplier!.id,
      voucherDate: formData.voucherDate
    }, {
      onSuccess: (data) => {
        showToast(`Purchase voucher "${data.voucherNumber}" created successfully!`);
        if (APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create) {
          navigate(APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create(company_id, data.id));
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
        showToast("Could not create the purchase voucher header due to an error.");
      }
    });
  }, [createMutation, company_id, navigate, showToast]);

  return (
    <>
      <PurchaseVoucherInput onSave={handleSave} serverErrors={serverErrors} />
      {createMutation.isPending && <LoadingPopup message="Saving purchase voucher..." />}
    </>
  );
}
