import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Get token from localStorage
                if (!token) {
                    console.error("No auth token found!");
                    return;
                }

                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`  // Attach token in the header
                    }
                });

                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchAllJobs();
    }, [searchedQuery, dispatch]);
};

export default useGetAllJobs;
