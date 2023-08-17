import LoadingBar from 'react-top-loading-bar'
import { useAuth } from "../context/Auth";

export default function TopLoadingBar() {
    const { progress, setProgress } = useAuth();

    return (
        <LoadingBar
            color='#007bff'
            height={2}
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
        />
    )
}