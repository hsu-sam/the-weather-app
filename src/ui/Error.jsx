import { Navigate } from 'react-router';
import Button from './Button';

function Error() {
  const handleReload = function () {
    Navigate(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <img
        className="w-10.5"
        src="/assets/images/icon-error.svg"
        alt=""
        width="18"
        height="18"
      />

      <h1 className="text-5xl text-center">Something went wrong</h1>

      <p className="text-xl text-center">
        We couldn't connent (API error). Please try again in few moments.
      </p>

      <Button variant="secondary" size="small" onClick={handleReload}>
        <img src="/assets/images/icon-retry.svg" alt="" />
        Retry
      </Button>
    </div>
  );
}

export default Error;
