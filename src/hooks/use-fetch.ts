import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { baseUrlSelector } from '../store/selectors/app';
import useIsMounted from './use-is-mounted';

const useFetch = <T = any>(url: string) => {
  const baseUrl = useSelector(baseUrlSelector, shallowEqual);

  const isMounted = useIsMounted();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${baseUrl}${url}`);
        const { data } = await response.json();

        setData(data as T);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (baseUrl && isMounted) {
      getData();
    }
  }, [baseUrl, url, isMounted]);

  return {
    isLoading,
    error,
    data,
  };
};

export default useFetch;
