import 'react-toastify/dist/ReactToastify.css';

import { toast, ToastContainer } from 'react-toastify';

export const OverlayStack = ToastContainer;

export function showToast(
  text: string,
  config?: {
    duration?: number;
    type?: 'error' | 'info' | 'warn' | 'success' | 'none';
  },
): void {
  const { duration = 2000, type = 'none' } = config ?? {};
  const toastConfig = {
    position: 'top-center',
    autoClose: duration,
    hideProgressBar: true,
    progress: undefined,
  } as any;
  switch (type) {
    case 'error':
      toast.error(text, toastConfig);
      return;
    case 'warn':
      toast.warn(text, toastConfig);
      return;
    case 'info':
      toast.info(text, toastConfig);
      return;
    case 'success':
      toast.success(text, toastConfig);
      return;
    default:
      toast(text, toastConfig);
      return;
  }
}
