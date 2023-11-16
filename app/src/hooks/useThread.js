import {useState, useEffect} from 'react';
import {createNewThread, fetchThread} from "../services/api";
import {runFinishedStates} from "./constants";

export const useThread = (run, setRun) => {
    const [threadId, setThreadId] = useState(undefined);
    const [thread, setThread] = useState(undefined);
    const [actionMessages, setActionMessages] = useState([]);
    const [messages, setMessages] = useState([]);

    // This hook is responsible for creating a new thread if one doesn't exist
    useEffect(() => {
        if (threadId === undefined) {
            const localThreadId = localStorage.getItem("thread_id");
            if (localThreadId) {
                console.log(`Resuming thread ${localThreadId}`);
                setThreadId(localThreadId);
                fetchThread(localThreadId).then(setThread);
            } else {
                console.log("Creating new thread");
                createNewThread().then((data) => {
                    setRun(data);
                    setThreadId(data.thread_id);
                    localStorage.setItem("thread_id", data.thread_id);
                    console.log(`Created new thread ${data.thread_id}`);
                });
            }
        }
    }, [threadId, setThreadId, setThread, setRun]);

    // This hook is responsible for fetching the thread when the run is finished
    useEffect(() => {
        if (!run || !runFinishedStates.includes(run.status)) {
            return;
        }

        console.log(`Retrieving thread ${run.thread_id}`);
        fetchThread(run.thread_id)
            .then((threadData) => {
                setThread(threadData);
            });
    }, [run, runFinishedStates, setThread]);

    // This hook is responsible for transforming the thread into a list of messages
    useEffect(() => {
        if (!thread) {
            return;
        }
        console.log(`Transforming thread into messages`);

        let newMessages = [...thread.messages, ...actionMessages]
            .sort((a, b) => a.created_at - b.created_at)
            .filter((message) => message.hidden !== true)
        setMessages(newMessages);
    }, [thread, actionMessages, setMessages]);

    const clearThread = () => {
        localStorage.removeItem("thread_id");
        setThreadId(undefined);
        setThread(undefined);
        setRun(undefined);
        setMessages([]);
        setActionMessages([]);
    }

    return {
        threadId,
        messages,
        actionMessages,
        setActionMessages,
        clearThread
    };
};