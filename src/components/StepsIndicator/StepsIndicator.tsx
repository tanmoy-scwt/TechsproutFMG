// "use client";
// import React, { useEffect, useState } from 'react';
// import styles from './style.module.css';
// import { RiVipCrown2Fill } from 'react-icons/ri';
// import { FaUserGraduate } from "react-icons/fa6";
// import { FaUser } from "react-icons/fa";
// import { usePathname, useSearchParams } from 'next/navigation';
// import { dashboardLinks as dl } from "@/lib/constants";
// const steps = [
//     { label: 'Profile', icon: FaUser },
//     { label: 'Courses', icon: FaUserGraduate },
//     { label: 'Subscription', icon: RiVipCrown2Fill },
// ];

// const StepIndicator = () => {
//     const pathname = usePathname();
//     const [activePage, setActivePage] = useState(1);
//     const paths = pathname.split('/');
//     // useEffect(() => {
//     //     if (paths.includes('profile')) {
//     //         setActivePage(1);
//     //     } else if (paths.includes('courses')) {
//     //         setActivePage(2);
//     //     }
//     //     else if (paths.includes('pricing-and-plans')) {
//     //         setActivePage(3);
//     //     }
//     // }, []);
//     useEffect(() => {
//         if (paths.includes(dl.profile)) {
//             setActivePage(1);
//         } else if (paths.includes(dl.addCourses)) {
//             setActivePage(2);
//         }
//         else if (paths.includes(dl.pricingAndPlans)) {
//             setActivePage(3);
//         }
//     }, []);

//     console.log(pathname, "pathname in step indicator");

//     return (
//         <div className={styles.stepContainer}>
//             {steps.map((step, index) => {
//                 const stepIndex = index + 1;
//                 const isActive = stepIndex <= activePage;

//                 return (
//                     <div key={index} className={styles.stepWrapper}>
//                         <div className={styles.stepInner}>
//                             <div className={`${styles.stepCircle} ${isActive ? styles.active : ''}`}>
//                                 <span className={styles.stepIcon}><step.icon size={16} /></span>
//                             </div>

//                             {index < steps.length - 1 && (
//                                 <div className={`${styles.stepLine} ${activePage > stepIndex ? styles.filled : ''}`} />
//                             )}
//                         </div>
//                         <span className={styles.stepLabel}>{step.label}</span>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default StepIndicator;


"use client";
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { RiVipCrown2Fill } from 'react-icons/ri';
import { FaUserGraduate } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { usePathname, useRouter } from 'next/navigation';
import { dashboardLinks as dl } from "@/lib/constants";



const StepIndicator = ({ ifAnyCourseExists }: { ifAnyCourseExists: string | undefined }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [activePage, setActivePage] = useState(1);

    const steps = [
        { label: 'Profile', icon: FaUser, path: dl.profile },
        { label: 'Courses', icon: FaUserGraduate, path: ifAnyCourseExists == 'true' ? dl.courses : dl.addCourses },
        { label: 'Subscription', icon: RiVipCrown2Fill, path: dl.pricingAndPlans },
    ];
    useEffect(() => {
        if (pathname.includes(dl.profile)) {
            setActivePage(1);
        } else if (pathname.includes(ifAnyCourseExists == 'true' ? dl.courses : dl.addCourses)) {
            setActivePage(2);
        } else if (pathname.includes(dl.pricingAndPlans)) {
            setActivePage(3);
        }
    }, [pathname]);

    return (
        <div className={styles.stepContainer}>
            {steps.map((step, index) => {
                const stepIndex = index + 1;
                const isActive = stepIndex <= activePage;

                const handleClick = () => {
                    if (isActive) {
                        router.push(step.path);
                    }
                };

                return (
                    <>
                        <div key={index} className={styles.stepWrapper}>
                            <div className={styles.stepInner}>
                                <div
                                    className={`${styles.stepCircle} ${isActive ? styles.active : ''}`}
                                    onClick={handleClick}
                                    style={{ cursor: isActive ? 'pointer' : 'default' }}
                                >
                                    <span className={styles.stepIcon}><step.icon size={16} /></span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className={`${styles.stepLine} ${activePage > stepIndex ? styles.filled : ''}`} />
                                )}
                            </div>
                            <span className={styles.stepLabel}>{step.label}</span>
                        </div>
                    </>
                );
            })}
        </div>
    );
};

export default StepIndicator;
