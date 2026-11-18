import { useEffect } from 'react';

const useExternalScript = (jsUrl, cssUrl) => {
    useEffect(() => {
        if (cssUrl && !document.querySelector(`link[href="${cssUrl}"]`)) {
            const link = document.createElement('link');
            link.href = cssUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        if (jsUrl && !document.querySelector(`script[src="${jsUrl}"]`)) {
            const script = document.createElement('script');
            script.src = jsUrl;
            script.async = true;
            document.body.appendChild(script);
        }
    }, [jsUrl, cssUrl]);
};

export default useExternalScript;
