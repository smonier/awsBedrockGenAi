import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/editor.proptypes';
import {DropdownTreeSelect} from '~/DesignSystem/DropdownTreeSelect';
import {useQuery} from '@apollo/react-hooks';
import {GetTree} from './contentDropdownTreeSelect.gql-queries';
import {adaptToTree} from './contentDropdownTreeSelect.adapter';
import {useTranslation} from 'react-i18next';
// Import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

export const ContentDropdownTreeSelect = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const {selectorOptions: {path, types}} = field;

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
    editorContext: PropTypes.shape({
        lang: PropTypes.string.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
