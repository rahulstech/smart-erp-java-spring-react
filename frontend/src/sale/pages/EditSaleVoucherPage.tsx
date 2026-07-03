import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetSaleVoucherById, useUpdateSaleVoucher } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { Customer } from '../../common/types/model.types';
import SaleVoucherInput from '../components/SaleVoucherInput';
import { SaleVoucherFormData } from '../types/sale.types';

interface EditSaleVoucherMainProps {
  voucher: {
    customerId: string;
    customerName: string;
    voucherDate: string;
    voucherNumber: string;
  };
  onSave: (formData: SaleVoucherFormData) => void;
  serverErrors?: { customer?: string; voucherDate?: string };
}

function EditSaleVoucherMain({
  voucher,
  onSave,
  serverErrors
}: EditSaleVoucherMainProps) {
  const saleVoucherFormData = useMemo<SaleVoucherFormData | undefined>(() => {
    if (!voucher) return undefined;
    return {
      customer: {
        id: voucher.customerId,
        name: voucher.customerName,
        phone: '',
        currentBalance: 0
      } as Customer,
      voucherDate: voucher.voucherDate
    };
  }, [voucher]);

  return (
    <>
      {saleVoucherFormData && (
        <SaleVoucherInput
          onSave={onSave}
          initialData={saleVoucherFormData}
          serverErrors={serverErrors}
          voucherNumber={voucher.voucherNumber}
        />
      )}
    </>
  );
}

export default function EditSaleVoucherPage() {
  const { company_id, voucher_id } = useParams<{ company_id: string; voucher_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<{ customer?: string; voucherDate?: string } | undefined>(undefined);

  const { data: voucher, isLoading, isError, refetch } = useGetSaleVoucherById(company_id || '', voucher_id || '');
  const updateMutation = useUpdateSaleVoucher(company_id || '');

  useEffect(() => {
    setTitle(voucher ? `Edit Voucher ${voucher.voucherNumber}` : "Edit Sale Voucher");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch, voucher]);

  const handleSave = useCallback((formData: SaleVoucherFormData) => {
    setServerErrors(undefined);

    updateMutation.mutate({
      voucherId: voucher_id || '',
      payload: {
        customerId: formData.customer!.id,
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
        showToast("Could not update the sale voucher due to an error.");
      }
    });
  }, [updateMutation, voucher_id, navigate, showToast]);

  return (
    <>
      {isError ? (
        <div className="flex w-full h-full justify-center items-center p-6">
          <Card className="max-w-md w-full mx-auto">
            <p className="text-sm font-semibold text-zinc-800">Could not load the sale voucher details.</p>
            <p className="text-xs text-zinc-500 mt-2">
              <strong>F5</strong>: Retry
            </p>
          </Card>
        </div>
      ) : (
        voucher && <EditSaleVoucherMain voucher={voucher} onSave={handleSave} serverErrors={serverErrors} />
      )}
      {(isLoading || updateMutation.isPending) && (
        <LoadingPopup message={updateMutation.isPending ? "Updating sale voucher..." : "Loading voucher details..."} />
      )}
    </>
  );
}
