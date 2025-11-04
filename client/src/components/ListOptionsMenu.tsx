import { Menu } from '@mantine/core'
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';

export type ListOptionsMenuProps = {
    onClearSelected: () => void;
}

export const ListOptionsMenu = ({ onClearSelected }: ListOptionsMenuProps) => {

    return (
        <Menu withArrow position="bottom" withinPortal>
            <Menu.Target>
                <IconDotsVertical size={20} style={{ marginLeft: 8, cursor: 'pointer' }} />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item color='red' onClick={onClearSelected}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconTrash size={16} />
                        <span style={{ marginLeft: 8 }}>Tyhjennä valitut</span>
                    </div>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}