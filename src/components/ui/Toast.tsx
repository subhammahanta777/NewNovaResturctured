import { Toaster } from 'sonner';

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="light"
    />
  );
};