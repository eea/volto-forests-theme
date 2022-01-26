import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Portal } from 'react-portal';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import { getBaseUrl } from '@plone/volto/helpers';
import { updateContent } from '@plone/volto/actions';
import { Icon, Toast } from '@plone/volto/components';
import copySVG from '@plone/volto/icons/copy.svg';
import pasteSVG from '@plone/volto/icons/paste.svg';

import './style.less';

const TIMEOUT = 2000;

const CopyPaste = (props) => {
  const [readyToRender, setReadyToRender] = React.useState(false);
  const clock = React.useRef(null);
  const time = React.useRef(0);
  const toolbar = React.useRef(null);
  const { content } = props;

  const copyData = () => {
    navigator.clipboard.writeText(
      JSON.stringify({
        blocks: content.blocks,
        blocks_layout: content.blocks_layout,
      }),
    );
    toast.success(
      <Toast success title={'Success'} content={`Copied blocks`} />,
    );
  };

  const pasteData = () => {
    const message = [
      '============= BRAKING CHANGE =============',
      '\nAre you sure you want to paste from clipboard?',
      '\nThis action will replace all the blocks with those from clipboard and will trigger SUBMIT !!!',
    ];
    navigator.clipboard.readText().then((text) => {
      if (
        // eslint-disable-next-line no-alert
        window.confirm(message.join(''))
      ) {
        try {
          const data = JSON.parse(text) || {};
          const { blocks = {}, blocks_layout = {} } = data;
          const blocksIds = Object.keys(blocks);
          let valid = true;
          if (
            blocks_layout &&
            blocks_layout.items &&
            blocks_layout.items.length === blocksIds.length
          ) {
            blocks_layout.items.forEach((block) => {
              if (valid && !blocksIds.includes(block)) {
                valid = false;
              }
            });
          }
          if (valid) {
            props.updateContent(getBaseUrl(props.pathname), data);
            toast.success(
              <Toast
                success
                title={'Success'}
                content={'Blocks replaced successfully'}
              />,
            );
          } else {
            toast.error(
              <Toast
                error
                title={'Error'}
                content={'Your clipboard contains incompatible data'}
              />,
            );
          }
        } catch {
          toast.error(
            <Toast
              error
              title={'Error'}
              content={'Your clipboard contains incompatible data'}
            />,
          );
        }
      }
    });
  };

  React.useEffect(() => {
    clock.current = setInterval(() => {
      const element = document.querySelector('#toolbar .toolbar-actions');
      if (element) {
        setReadyToRender(true);
        clearInterval(clock.current);
        time.current = 0;
        return;
      }
      if (time.current >= TIMEOUT) {
        clearInterval(clock.current);
        time.current = 0;
        return;
      }
      time.current += 100;
    }, 100);
    return () => {
      clearInterval(clock.current);
      time.current = 0;
    };
  }, []);

  if (!__CLIENT__ || !readyToRender) return '';

  return (
    <Portal node={document.querySelector('#toolbar .toolbar-actions')}>
      <div
        ref={toolbar}
        id="__developer_tools"
        onMouseEnter={(e) => {
          if (
            e.altKey &&
            e.ctrlKey &&
            toolbar.current &&
            !toolbar.current.classList.contains('__dev_on')
          ) {
            toolbar.current.classList.add('__dev_on');
          }
        }}
        onMouseLeave={(e) => {
          if (
            toolbar.current &&
            toolbar.current.classList.contains('__dev_on')
          ) {
            toolbar.current.classList.remove('__dev_on');
          }
        }}
        onFocus={() => {}}
      >
        <Button
          className="copy"
          aria-label="Copy blocks data"
          title="Copy blocks data"
          onClick={copyData}
        >
          <Icon name={copySVG} className="circled" size="30px" />
        </Button>
        <Button
          className="paste"
          aria-label="Paste blocks data"
          title="Paste blocks data"
          onClick={pasteData}
          disabled={props.updateRequest.loading}
        >
          <Icon name={pasteSVG} className="circled" size="30px" />
        </Button>
      </div>
    </Portal>
  );
};

export default compose(
  connect(
    (state, props) => ({
      content: state.content.data,
      updateRequest: state.content.update,
      pathname: props.location.pathname,
    }),
    {
      updateContent,
    },
  ),
)(CopyPaste);
