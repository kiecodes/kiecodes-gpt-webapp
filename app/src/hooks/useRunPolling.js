import {useEffect, useRef} from 'react';
import {fetchRun} from "../services/api";
import {runFinishedStates} from "./constants";

export const useRunPolling = (threadId, run, setRun) => {
    const pollingTimerRef = useRef(null);

    const startPolling = async () => {
        console.log(`Polling thread ${threadId} run ${run.run_id}`);
        const data = await fetchRun(threadId, run.run_id);
        if (data.run_id !== run.run_id || data.status !== run.status) {
            setRun(data);
        }
        pollingTimerRef.current = setTimeout(startPolling, 1000);
    };

    const stopPolling = () => clearInterval(pollingTimerRef.current);

    useEffect(() => {
        const needsToPoll = run && !runFinishedStates.includes(run.status);

        if (needsToPoll) {
            startPolling();
        } else {
            stopPolling();
        }

        return stopPolling;
    }, [threadId, run, setRun, runFinishedStates]);
};
