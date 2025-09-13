
/**
 * To use these icons, import them into your component like this:
 * import { DashboardIcon, LogsIcon } from './path/to/svg.jsx';
 *
 * Then you can use them as regular React components:
 * <DashboardIcon />
 */

export const DashboardIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);

export const LogsIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);

export const SettingsIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const StatusIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

export const LogoutIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
    </svg>
);

export const RefreshIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#999999"
        {...props}
    >
        <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
    </svg>
);

export const FolderIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-slate-500"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
);

export const LockClosedIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


export const LockOpenIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm1 11a1 1 0 11-2 0 1 1 0 012 0zM9 7a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);

export const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const RemoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 9.393a15 15 0 0121.214 0" />
    </svg>
);

export const PowerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
)

export const TankIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"></path>
    </svg>
);

// A wider container icon to represent a reservoir.
export const ReservoirIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M4 20h16" />
        <path d="M4 6h16" />
        <path d="M6 6v14" />
        <path d="M18 6v14" />
        <path d="M6 12h12" />
        <path d="M6 16h12" />
    </svg>
);

export const LevelIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor" // This makes it use the Tailwind text color
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M2.5 14.5L3.11612 15.1161C3.68206 15.6821 4.44964 16 5.25 16C6.05036 16 6.81794 15.6821 7.38388 15.1161L7.61612 14.8839C8.18206 14.3179 8.94964 14 9.75 14C10.5504 14 11.3179 14.3179 11.8839 14.8839L12.1161 15.1161C12.6821 15.6821 13.4496 16 14.25 16C15.0504 16 15.8179 15.6821 16.3839 15.1161L16.6161 14.8839C17.1821 14.3179 17.9496 14 18.75 14C19.5504 14 20.3179 14.3179 20.8839 14.8839L21.5 15.5M2.5 19.5L3.11612 20.1161C3.68206 20.6821 4.44964 21 5.25 21C6.05036 21 6.81794 20.6821 7.38388 20.1161L7.61612 19.8839C8.18206 19.3179 8.94964 19 9.75 19C10.5504 19 11.3179 19.3179 11.8839 19.8839L12.1161 20.1161C12.6821 20.6821 13.4496 21 14.25 21C15.0504 21 15.8179 20.6821 16.3839 20.1161L16.6161 19.8839C17.1821 19.3179 17.9496 19 18.75 19C19.5504 19 20.3179 19.3179 20.8839 19.8839L21.5 20.5M12 11V3M12 3L9 6M12 3L15 6" />
    </svg>
);

export const UpdateIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M21 21v-5h-5" />
    </svg>
);

export const UpArrowIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5" // You can adjust size here
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
);

export const RetryIcon = (props) => (
    <svg width="15px" height="15px" viewBox="-1.6 -1.6 19.20 19.20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" stroke-width="0.00016"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.032"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M14.9547098,7.98576084 L15.0711,7.99552 C15.6179,8.07328 15.9981,8.57957 15.9204,9.12636 C15.6826,10.7983 14.9218,12.3522 13.747,13.5654 C12.5721,14.7785 11.0435,15.5888 9.37999,15.8801 C7.7165,16.1714 6.00349,15.9288 4.48631,15.187 C3.77335,14.8385 3.12082,14.3881 2.5472,13.8537 L1.70711,14.6938 C1.07714,15.3238 3.55271368e-15,14.8776 3.55271368e-15,13.9867 L3.55271368e-15,9.99998 L3.98673,9.99998 C4.87763,9.99998 5.3238,11.0771 4.69383,11.7071 L3.9626,12.4383 C4.38006,12.8181 4.85153,13.1394 5.36475,13.3903 C6.50264,13.9466 7.78739,14.1285 9.03501,13.9101 C10.2826,13.6916 11.4291,13.0839 12.3102,12.174 C13.1914,11.2641 13.762,10.0988 13.9403,8.84476 C14.0181,8.29798 14.5244,7.91776 15.0711,7.99552 L14.9547098,7.98576084 Z M11.5137,0.812976 C12.2279,1.16215 12.8814,1.61349 13.4558,2.14905 L14.2929,1.31193 C14.9229,0.681961 16,1.12813 16,2.01904 L16,6.00001 L12.019,6.00001 C11.1281,6.00001 10.6819,4.92287 11.3119,4.29291 L12.0404,3.56441 C11.6222,3.18346 11.1497,2.86125 10.6353,2.60973 C9.49736,2.05342 8.21261,1.87146 6.96499,2.08994 C5.71737,2.30841 4.57089,2.91611 3.68976,3.82599 C2.80862,4.73586 2.23802,5.90125 2.05969,7.15524 C1.98193,7.70202 1.47564,8.08224 0.928858,8.00448 C0.382075,7.92672 0.00185585,7.42043 0.0796146,6.87364 C0.31739,5.20166 1.07818,3.64782 2.25303,2.43465 C3.42788,1.22148 4.95652,0.411217 6.62001,0.119916 C8.2835,-0.171384 9.99651,0.0712178 11.5137,0.812976 Z"></path> </g></svg>
);

export const CloudOffIcon = () => (
    <svg width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11L14 15M14 11L10 15M8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z" stroke="#d55d5d" stroke-width="1.128" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
)
