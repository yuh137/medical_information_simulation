import React, { createContext, useContext, useState } from 'react'

interface ReportContextType {
    reportId: string | null;
    changeReportId: (reportId: string | null) => void;
}

interface ReportProviderProps {
  children: React.ReactNode;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = (props: ReportProviderProps) => {
    const [reportId, setReportId] =  useState<string | null>(null);

    function changeReportId(reportId: string | null): void {
        setReportId(reportId);
    }
    
    return (
        <ReportContext.Provider value={{ reportId, changeReportId }}>
            {props.children}
        </ReportContext.Provider>
    )
}

export const useReport = (): ReportContextType => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("useReport must be used within an ReportProvider");
    }

    return context;
}