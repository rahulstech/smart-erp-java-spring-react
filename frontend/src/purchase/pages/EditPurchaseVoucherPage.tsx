import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetPurchaseVoucherById, useUpdatePurchaseVoucher } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { Supplier } from '../../common/types/model.types';
import PurchaseVoucherInput from '../components/PurchaseVoucherInput';
import { PurchaseVoucherFormData } from '../types/purchase.types';

export default function EditPurchaseVoucherPage() {
  const { company_id, voucher_id } = useParams<{ company_id: string; voucher_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<{ supplier?: string; voucherDate?: string } | undefined>(undefined);

  const { data: voucher, isLoading, isError, refetch } = useGetPurchaseVoucherById(company_id || '', voucher_id || '');
  const updateMutation = useUpdatePurchaseVoucher(company_id || '');

  useEffect(() => {
    setTitle(voucher ? `Edit Voucher ${voucher.voucherNumber}` : "Edit Purchase Voucher");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch, voucher]);

  const handleSave = useCallback((formData: PurchaseVoucherFormData) => {
    setServerErrors(undefined);

    updateMutation.mutate({
      voucherId: voucher_id || '',
      payload: {
        supplierId: formData.supplier!.id,
        voucherDate: formData.voucherDate
      }
    }, {
      onSuccess: (data) => {
        showToast(`Voucher "${data.voucherNumber}" updated successfully!`);
        navigate(-1);
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
        showToast("Could not update the purchase voucher due to an error.");
      }
    });
  }, [updateMutation, voucher_id, navigate, showToast]);

  const purchaseVoucherFormData = useMemo<PurchaseVoucherFormData | undefined>(() => {
    if (!voucher) return undefined;
    return {
      supplier: {
        id: voucher.supplierId,
        name: voucher.supplierName,
        code: '',
        companyId: ''
      } as Supplier,
      voucherDate: voucher.voucherDate
    };
  }, [voucher]);

  return (
    <>
      {
        (isLoading || updateMutation.isPending) ? (
          <LoadingPopup message={updateMutation.isPending ? "Saving purchase voucher..." : "Loading voucher details..."} />
        )
        : (isError || !voucher) ? (
          <div className="flex w-full h-full justify-center items-center p-6">
            <Card className="max-w-md w-full mx-auto">
              <p className="text-sm font-semibold text-zinc-800">Could not load the purchase voucher details.</p>
              <p className="text-xs text-zinc-500 mt-2">
                <strong>F5</strong>: Retry
              </p>
            </Card>
          </div>
        ) : (
          <PurchaseVoucherInput
            onSave={handleSave}
            initialData={purchaseVoucherFormData}
            serverErrors={serverErrors}
            voucherNumber={voucher.voucherNumber}
          />
        )
      }
    </>
  );
}
