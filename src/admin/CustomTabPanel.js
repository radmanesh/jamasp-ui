import { Box, Container } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * CustomTabPanel component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the tab panel.
 * @param {number} props.value - The currently selected tab index.
 * @param {number} props.index - The index of the tab panel.
 * @param {Object} props.other - Additional props to be spread on the root element.
 * @returns {JSX.Element} The rendered CustomTabPanel component.
 */
export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Container>{children}</Container>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
