import {useState, useEffect} from 'react';
import {runFinishedStates} from "./constants";

export const useRunStatus = (run) => {
    const [status, setStatus] = useState(undefined);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (run?.status === "in_progress") {
            setStatus("Thinking ...");
        } else if (run?.status === "queued") {
            setStatus("Queued ...");
        } else {
            setStatus(undefined);
        }
    }, [run]);

    useEffect(() => {
        setProcessing(!runFinishedStates.includes(run?.status ?? "completed"));
    }, [run]);

    return {status, processing};
};
