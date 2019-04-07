import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from "./Loader.jsx";
import { SourceFactory } from "../../core/Source/SourceFactory";
import { SourceSizeAdjuster } from "../../core/Source/SourceSizeAdjuster";
import { FADE_IN_CLASS_NAME, FADE_IN_COMPLETE_CLASS_NAME } from "../../constants/CssConstants";

let isLoaderVisible;
let shouldCallUpdateAfterMount;

class Source extends Component {
    constructor(props) {
        super(props);
        shouldCallUpdateAfterMount = false;
        isLoaderVisible = true;
        // request succeeded when lightbox was closed
        if (this.props.fsLightbox.sourcesData.sourcesToCreateOnConstruct[this.props.i]) {
            shouldCallUpdateAfterMount = true;
            this.createSource();
        }
        this.onFirstSourceLoad = this.onFirstSourceLoad.bind(this);
    }

    createSource() {
        isLoaderVisible = false;
        const sourceFactory = new SourceFactory(this.props.fsLightbox);
        sourceFactory.setOnFirstSourceLoad(this.onFirstSourceLoad);
        sourceFactory.setSourceIndex(this.props.i);
        this.props.fsLightbox.elements.sourcesJSXComponents[this.props.i] = sourceFactory.getSourceComponent();
        if (!shouldCallUpdateAfterMount) {
            this.sourceWasCreated();
        }
    }

    sourceWasCreated() {
        // after that refresh source stored in sourcesJSXComponents is attached so we can access refs
        this.forceUpdate();
    }

    componentDidMount() {
        if (shouldCallUpdateAfterMount) {
            this.sourceWasCreated();
        }
        // if source was already loaded we need to call onSourceLoad after component mount
        if (this.props.fsLightbox.sourcesData.isSourceAlreadyLoadedArray[this.props.i]) {
            this.onSourceLoad();
        }
    }


    onFirstSourceLoad() {
        // TODO: THERE WAS LINE WITH CLASSING REMOVE REMOVED TEST IT
        // this.props.fsLightbox.elements.sources[this.props.i].current.classList.remove('fslightbox-opacity-0');
        this.props.fsLightbox.sourcesData.isSourceAlreadyLoadedArray[this.props.i] = true;
        // we are creating source size adjuster after first load because we need already source dimensions
        const sourceSizeAdjuster = new SourceSizeAdjuster(this.props.fsLightbox);
        sourceSizeAdjuster.setIndex(this.props.i);
        this.props.fsLightbox.collections.sourceSizeAdjusters[this.props.i] = sourceSizeAdjuster;
        this.onSourceLoad();
    }

    onSourceLoad() {
        this.fadeInSource();
        // source size adjuster may be not set if source is invalid
        if (this.props.fsLightbox.collections.sourceSizeAdjusters[this.props.i])
            this.props.fsLightbox.collections.sourceSizeAdjusters[this.props.i].adjustSourceSize();
    }


    fadeInSource() {
        // we are fading in source only if it's in stage
        if (!this.props.fsLightbox.core.stageSources.isSourceInStage(this.props.i))
            return;

        // we will add longer fade-in for better UX
        if (this.props.i === this.props.fsLightbox.state.slide - 1) {
            this.props.fsLightbox.elements.sources[this.props.i].current.classList.add(FADE_IN_COMPLETE_CLASS_NAME)
        } else {
            this.props.fsLightbox.elements.sources[this.props.i].current.classList.add(FADE_IN_CLASS_NAME);
        }
    }


    render() {
        const loader = (this.props.fsLightbox.sourcesData.isSourceAlreadyLoadedArray[this.props.i] ||
            !isLoaderVisible) ?
            null : <Loader/>;

        return (
            <>
                { loader }
                { this.props.fsLightbox.elements.sourcesJSXComponents[this.props.i] }
            </>
        );
    }
}


Source.propTypes = {
    fsLightbox: PropTypes.object.isRequired,
    i: PropTypes.number.isRequired
};
export default Source;