'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './style.module.css';
import { dashboardLinks } from '@/lib/constants';
import { memo, useCallback, useState } from 'react';

const ProfileCompleteWelcomeCard = () => {
    const [profileComplete, setProfileComplete] = useState<boolean>(false);
    const changeProfileComplete = useCallback(() => {
        setProfileComplete(true);
    }, [])
    return (
        <div style={{ display: profileComplete ? 'none' : '' }} className={styles.mobileContainer}>
            <Image src="/img/mobileLogo.png" alt="Find My Guru Logo" width={120} height={122} />
            <div className={styles.contentCheckmark}>
                <div className={styles.checkmarkCircle}>
                    {/* <span className={styles.checkmark}>✓</span> */}
                    <Image src="/img/checkmark.png" alt="Find My Guru Logo" width={202} height={202} />
                </div>
                <div className={styles.content}>
                    <h2>you profile is ready</h2>
                    <p>Next, create your first course</p>
                    <Link href={dashboardLinks.addCourses} onClick={changeProfileComplete} className={styles.ctaButton}>
                        Create Your First Course
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default memo(ProfileCompleteWelcomeCard);
