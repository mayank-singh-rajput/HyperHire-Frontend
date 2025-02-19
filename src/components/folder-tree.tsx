'use client';

import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { unstable_useTreeItem2 as useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import { TreeItem2Content, TreeItem2IconContainer, TreeItem2Label, TreeItem2Root } from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import FormateTreeData, { TreeItems } from '../utils/formateData';
import { useQueryClient } from '@tanstack/react-query';

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

interface CustomLabelProps {
    children: React.ReactNode;
    expandable?: boolean;
}

function CustomLabel({ children, ...other }: CustomLabelProps) {
    return (
        <TreeItem2Label {...other} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography className="labelText" sx={{ color: '#101828', fontSize: "14px", fontWeight: 400 }}>
                {children}
            </Typography>
        </TreeItem2Label>
    );
}

interface CustomTreeItemProps extends Omit<UseTreeItem2Parameters, 'rootRef'>, Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> { }

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props: CustomTreeItemProps, ref: React.Ref<HTMLLIElement>) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const { getRootProps, getContentProps, getIconContainerProps, getLabelProps, getGroupTransitionProps, status, publicAPI } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);    
    const color = item?.color;
    const isRootItem = item?.parentId === null;

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)} sx={{ position: 'relative', borderLeft: isRootItem ? 'none' : '2px solid #ccc' }}>
                <TreeItem2Content
                    {...getContentProps({
                        className: clsx('content', { expanded: status.expanded, selected: status.selected, focused: status.focused, disabled: status.disabled }),
                        sx: { display: 'flex', alignItems: 'center', paddingLeft: 4 },
                    })}
                >
                    {status.expandable && (
                        <TreeItem2IconContainer {...getIconContainerProps()}>
                            <TreeItem2Icon status={status} />
                        </TreeItem2IconContainer>
                    )}

                    <CustomLabel {...getLabelProps({ color })} />
                </TreeItem2Content>
                {children && <TransitionComponent {...getGroupTransitionProps({ className: 'groupTransition' })} />}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});

export default function FolderTreeView() {
    const queryClient = useQueryClient();
    const folderData = queryClient.getQueryData(['folders']) as TreeItems[] || [];
    const data = FormateTreeData(folderData);

    return (
        <Box>
            <Box sx={{ my: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: "#1D2939", height: '38px', borderRadius: "48px", textTransform: "none", }}>
                    Expand All
                </Button>

                <Button variant="outlined" sx={{ borderColor: "#D0D5DD", color: "#475467", height: '38px', borderRadius: "48px", textTransform: "none", }}>
                    Collapse All
                </Button>
            </Box>

            <RichTreeView
                items={data}
                aria-label="pages"
                multiSelect
                sx={{
                    height: 'fit-content',
                    flexGrow: 1,
                    overflowY: 'auto',
                }}
                slots={{ item: CustomTreeItem }}
            />
        </Box>
    );
}
