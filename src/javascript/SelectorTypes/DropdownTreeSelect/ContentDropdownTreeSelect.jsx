import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../editor.proptypes';
import {useQuery} from '@apollo/react-hooks';
import {GetTree} from './contentDropdownTreeSelect.gql-queries';
import {adaptToTree} from './contentDropdownTreeSelect.adapter';
import {useTranslation} from 'react-i18next';
import {LoaderOverlay} from '../../DesignSystem/LoaderOverlay';
import {Dropdown} from '@jahia/moonstone';

const pageTree = {
    contentPath: '$currentSite',
    contentTypes: 'jnt:page,jnt:navMenuText'
};
const categoryTree = {
    contentPath: '/sites/systemsite/categories',
    contentTypes: 'jnt:category'
};
// Configs
// const pageTree = [
//     {name:'contentPath',value:'$currentSite'},
//     {name: 'contentTypes',value: 'jnt:page,jnt:navMenuText'}
// ]
// const categoryTree = [
//     {name:'contentPath',value:'systemsite/categories'},
//     {name: 'contentTypes',value: 'jnt:category'}
// ]

const cmpPreconfiguredParams = {
    pageTree,
    categoryTree,
    default: categoryTree

};

// Cannot use editorContext.siteInfo.path because the value is systemSite if content
// is open in repository explorer
const getCurrentSite = editorContext => {
    const scopeRegex = /\/sites\/(?<scope>[\w\d.-]*)\//mi;
    const scopeExec = scopeRegex.exec(editorContext.path);
    if (scopeExec) {
        const {groups: {scope}} = scopeExec;
        return `/sites/${scope}`;
    }
};

const selectorOptionsAdapter = (selectorOptions, editorContext) => {
    if (!selectorOptions) {
        return {};
    }

    return selectorOptions.reduce((options, item) => {
        switch (item.name) {
            case 'contentPath':
                options[item.name] = item.value.replace('$currentSite', getCurrentSite(editorContext));
                break;
            case 'contentTypes':
                options[item.name] = item.value.split(',');
                break;
            default:
                break;
        }

        return options;
    }, {});
};

export const ContentDropdownTreeSelect = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const selectorOptions = field.selectorOptions;
    const selectorType = selectorOptions?.find(option => option.name === 'type')?.value || 'default';
    const {contentPath, contentTypes} = Object.assign(cmpPreconfiguredParams[selectorType], selectorOptionsAdapter(selectorOptions, editorContext));

    const {data, error, loading} = useQuery(GetTree, {
        variables: {
            path: contentPath,
            types: contentTypes,
            language: editorContext.lang
        }
    });

    const handleClear = () => {
        if (field.multiple) {
            onChange([]);
        } else {
            onChange(null);
        }
    };

    const handleChange = (_, selectedValue) => {
        if (field.multiple) {
            const prev = value || [];
            onChange(prev.indexOf(selectedValue.value) > -1 ? prev.filter(i => i !== selectedValue.value) : [...prev, selectedValue.value]);
        } else {
            onChange(selectedValue.value);
        }
    };

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: `${contentPath} in ${editorContext.lang}`}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const tree = adaptToTree({
        nodes: data.jcr.result.descendants.nodes,
        parent: data.jcr.result,
        selectedValues: value,
        locale: editorContext.lang
    });

    const singleValue = !field.multiple ? value : undefined;
    const multipleValue = field.multiple ? (value || []) : undefined;

    return (
        <Dropdown
            hasSearch
            id={id}
            className="flexFluid"
            treeData={tree}
            variant="outlined"
            size="medium"
            value={singleValue}
            values={multipleValue}
            isDisabled={field.readOnly}
            onClear={handleClear}
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
