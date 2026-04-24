import { useEffect, useState } from "react";

interface UsePaginationProps {
    limit?: number;
    queryHook: any; 
    queryArgs?: any; 
}

const usePagination = ({ limit = 20, queryHook, queryArgs = {} }: UsePaginationProps) => {
    const [page, setPage] = useState(1);
    const [accumulatedData, setAccumulatedData] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { data: response, isLoading, isFetching } = queryHook({ 
        page, 
        limit,
        ...queryArgs 
    });

    const data = response?.data || response || [];

    useEffect(() => {
        if (data && data.length > 0) {
            if (page === 1) {
                setAccumulatedData(data);
            } else {
                setAccumulatedData((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const uniqueNewData = data.filter(
                        (p: any) => !existingIds.has(p.id)
                    );
                    return [...prev, ...uniqueNewData];
                });
            }
            setIsLoadingMore(false);
        } else if (page === 1 && !isLoading) {
            setAccumulatedData([]);
            setIsLoadingMore(false);
        }
    }, [data, page, isLoading]);

    const handleLoadMore = () => {
        if (!isFetching && !isLoading && !isLoadingMore && data.length === limit) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const resetPagination = () => {
        setPage(1);
        setAccumulatedData([]);
        setIsLoadingMore(false);
    };

    return { 
        page, 
        setPage, 
        accumulatedData, 
        isLoadingMore, 
        isLoading, 
        isFetching,
        handleLoadMore,
        resetPagination
    };
};

export default usePagination;