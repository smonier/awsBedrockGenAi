import React from 'react';
import PropTypes from 'prop-types';
import {EditorContextPropTypes, FieldPropTypes} from '../../editor.proptypes';
import {DropdownTreeSelect} from '../../DesignSystem/DropdownTreeSelect';
import {useQuery} from '@apollo/react-hooks';
import {GetTree} from './contentDropdownTreeSelect.gql-queries';
import {adaptToTree} from './contentDropdownTreeSelect.adapter';
import {useTranslation} from 'react-i18next';
// Import {useContentEditorContext} from '@jahia/content-editor';
// Import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
const defaultOptions = [
    {
        name: 'path',
        value: '$currentSite'
    },
    {
        name: 'types',
        value: 'jnt:page,jnt:navMenuText'
    }
];
export const ContentDropdownTreeSelect = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    // Const editorContext = useContentEditorContext();

    const selectorOptions = field.selectorOptions || defaultOptions;

    const _path = selectorOptions.find(option => option.name === 'path').value;
    const path = _path.replace('$currentSite', editorContext.siteInfo.path);
    const _types = selectorOptions.find(option => option.name === 'types').value;
    const types = _types.split(',');

    const {data, error, loading} = useQuery(GetTree, {
        variables: {
            path,
            types,
            language: editorContext.lang
        }
    });

    const handleChange = (_, selectedValues) => {
        const newValues = selectedValues.map(v => v.value);
        if (field.multiple) {
            onChange(newValues);
        } else {
            onChange(newValues[0]);
        }
    };

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: `${path} in ${editorContext.lang}`}
        );
        return <>{message}</>;
    }

    if (loading) {
        return 'Loading';
    }

    const tree = adaptToTree({
        nodes: data.jcr.result.descendants.nodes,
        parent: data.jcr.result,
        selectedValues: value,
        locale: editorContext.lang
    });

    return (
        <DropdownTreeSelect
            clearSearchOnChange
            keepTreeOnSearch
            id={id}
            noMatchesLabel={t('content-editor:label.contentEditor.edit.fields.category.noMatches')}
            aria-labelledby={`${field.name}-label`}
            data={tree}
            mode={field.multiple ? 'multiSelect' : 'radioSelect'}
            readOnly={field.readOnly}
            onChange={handleChange}
            onBlur={onBlur}
        />
    );
};

ContentDropdownTreeSelect.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    editorContext: EditorContextPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
