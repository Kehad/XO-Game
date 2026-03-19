

interface AlertModalProps {
    alertMessage: string;
    setAlertMessage: (message: string) => void;
    title?: string;
    type?: 'success' | 'error' | 'info';
}

function AlertModal({ alertMessage, setAlertMessage, title, type = 'info' }: AlertModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                );
            case 'info':
            default:
                return (
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                );
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (type) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'info':
            default: return 'Notification';
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'success': return 'bg-green-600 hover:bg-green-500 shadow-green-500/25 text-white';
            case 'error': return 'bg-red-600 hover:bg-red-500 shadow-red-500/25 text-white';
            case 'info':
            default: return 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-gray-800 border border-gray-700/80 rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center gap-4 text-center">
                    {getIcon()}
                    <h3 className="text-2xl font-bold text-white">{getTitle()}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{alertMessage}</p>
                    <button
                        onClick={() => setAlertMessage('')}
                        className={`mt-4 w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 ${getButtonClass()}`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AlertModal;