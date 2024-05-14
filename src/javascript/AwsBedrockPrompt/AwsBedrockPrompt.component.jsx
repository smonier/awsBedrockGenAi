import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {AwsBedrockPromptQuery} from './AwsBedrockPrompt.gql-queries.js';
import {AwsBedrockPromptMutation} from './AwsBedrockPrompt.gql-mutations.js';
import {Button, Header, Typography} from '@jahia/moonstone';
import styles from './AwsBedrockPrompt.component.scss';
import {useTranslation} from 'react-i18next';
import {useNotifications} from '@jahia/react-material';

export default () => {
    const sitePath = '/sites/' + window.contextJsParameters.siteKey;
    const {t} = useTranslation('aws-bedrock-gen-ai');
    const [textArea, setTextArea] = useState('');
    const notificationContext = useNotifications();
    const {data, error, loading, refetch} = useQuery(AwsBedrockPromptQuery, {
        variables: {path: sitePath, language: window.contextJsParameters.language},
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (loading === false && data) {
            setTextArea(data?.jcr?.nodeByPath?.property?.value);
        }
    }, [loading, data]);

    const [updatePrompt] = useMutation(AwsBedrockPromptMutation);

    if (loading) {
        return 'Loading ...';
    }

    if (error) {
        console.error(error);
        return 'There was an error reading AWS Bedrock configuration';
    }

    const initialValue = data?.jcr?.nodeByPath?.property?.value;
    const handleClick = () => updatePrompt({
        variables: {
            path: sitePath,
            value: textArea,
            publish: data?.jcr?.nodeByPath?.aggregatedPublicationInfo?.publicationStatus === 'PUBLISHED'
        }, refetchQueries: refetch
    }).then(() => notificationContext.notify(t('notification.save'), ['closeButton'], {autoHideDuration: 3000}));
    return (

        <>
            <Header title={t('header', {siteName: data?.jcr?.nodeByPath?.displayName})}
                    mainActions={[
                        <Button key="promptSaveButton"
                                size="big"
                                id="promptSaveButton"
                                color="accent"
                                isDisabled={textArea === initialValue}
                                label={t('save')}
                                onClick={handleClick}/>
                    ]}
            />
            <div className={styles.promptContainer}>
                <div className={styles.textContainer}>
                    <Typography className={styles.header} variant="heading">{t('heading')}</Typography>
                    <Typography className={styles.description} variant="caption" color="grey">{t('description')}</Typography>
                </div>
                <textarea id="promptTextArea" className={styles.promptTextArea} value={textArea} onChange={e => setTextArea(e.target.value)}/>
            </div>
        </>
    );
};
