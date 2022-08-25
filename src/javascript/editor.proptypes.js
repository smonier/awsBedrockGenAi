import PropTypes from 'prop-types';

export const SiteInfoPropTypes = PropTypes.shape({
    defaultLanguage: PropTypes.string.isRequired,
    description: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    languages: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
    serverName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    workspace: PropTypes.string.isRequired
});

export const FieldPropTypes = PropTypes.shape({
    name: PropTypes.string,
    selectorOptions: PropTypes.object,
    displayName: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    i18n: PropTypes.bool,
    selectorType: PropTypes.string,
    mandatory: PropTypes.bool,
    readOnly: PropTypes.bool,
    requiredType: PropTypes.string
});

export const EditorContextPropTypes = PropTypes.shape({
    lang: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    name: PropTypes.string,
    nodeData: PropTypes.object.isRequired,
    siteInfo: SiteInfoPropTypes.isRequired
});

