import React, {Suspense, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Loading, Typography} from '@jahia/moonstone';
import {withStyles, Grid} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {useSiteInfo, useNodeInfo} from '@jahia/data-helper';
import {useSelector} from 'react-redux';
import {registry} from '@jahia/ui-extender';
import {weakrefContentPropsQuery} from '../Components';
import {useQuery} from '@apollo/react-hooks';

const styles = () => ({
    button: {
        position: 'relative',
        top: -20
    },
    errorMessage: {
        color: '#E8B606',
        fontSize: 12,
        fontFamily: 'Nunito Sans, sans-serif',
        fontWeight: 600,
        marginTop: 10
    },
    typography: {
        color: 'rgba(19, 28, 33, 0.6)',
        fontSize: 12,
        fontFamily: 'Nunito Sans, sans-serif',
        fontWeight: 600
    }
});

const mergeArrayValues = (a = [], b = []) => {
    return [...new Set([...a, ...b])];
};

export const AwsBedrockTags = ({path, render: Render, ...props}) => {
    const {t} = useTranslation('aws-bedrock-gen-ai');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {editorContext, onChange, value, classes} = props;
    const {language, site} = useSelector(state => ({language: state.language, site: state.site}));
    const {siteInfo} = useSiteInfo({siteKey: site, displayLanguage: language});
    const {node, nodeLoading} = useNodeInfo({path: path, language: language}, {getDisplayName: true});

    const errorInit = node?.error || siteInfo?.error || nodeLoading?.error;
    if (errorInit) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: errorInit.message ? errorInit.message : ''}
        );

        console.warn(message);
    }

    const weakNodeInfo = useQuery(weakrefContentPropsQuery, {
        variables: {
            uuid: editorContext.nodeData.displayableNode.uuid
        },
        skip: !editorContext.nodeData.displayableNode.uuid
    });

    const weakNode = weakNodeInfo?.data?.jcr?.result;

    const superTypes = weakNode?.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = weakNode?.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = weakNode?.primaryNodeType?.name;
    const valueNodeTypes = [primaryNodeType, ...superTypes, ...mixinTypes];
    const isContent = (editorContext && valueNodeTypes.includes('jnt:content')) || (editorContext && valueNodeTypes.includes('jnt:page'));

    const formData = new FormData();
    formData.append('language', language);
    formData.append('button', true);

    const Tag = registry.get('selectorType', 'Tag').cmp;

    return (
        <Suspense fallback="AutoTextTags ...">
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Typography color="beta" variant="omega" className={classes.typography}>
                        {t('automatedTextTags.tagsField.help')}
                    </Typography>
                </Grid>
                <Grid item>
                    {isContent && <Button variant="outlined"
                                          label={loading ? t('automatedTextTags.tagsField.loading') : t('automatedTextTags.tagsField.tag')}
                                          className={classes.button}
                                          icon={loading ? <Loading/> : null}
                                          onClick={async () => {
                            setLoading(true);

                            const resp = await fetch(`${contextJsParameters.contextPath}/cms/editframe/default/${language}${editorContext.path}.requestAwsBedrock.do`, {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    accept: 'application/json'
                                  }
                            });

                            try {
                                setLoading(true);
                                const myData = await resp.json();
                                const list = myData.results;
                                if (list.length < 1) {
                                    setError(t('automatedTextTags.tagsField.empty'));
                                    return;
                                }

                                onChange(mergeArrayValues(value, list.map(a => a.toLowerCase())));
                            } catch (e) {
                                console.log('error:', e.message);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    /> }
                </Grid>
            </Grid>
            <Tag {...props}/>
            {
                error &&
                <Typography color="beta" variant="omega" className={classes.errorMessage}>
                    [{error}]
                </Typography>
            }
        </Suspense>
    );
};

AwsBedrockTags.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    field: PropTypes.object,
    onChange: PropTypes.func,
    editorContext: PropTypes.object,
    classes: PropTypes.object,
    path: PropTypes.object,
    render: PropTypes.object
};

export default withStyles(styles)(AwsBedrockTags);
