import React from "react";
import { Grid, Segment, Menu, Button, Dropdown, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { UserActions } from "../../redux/_actions/user/userA";
import LoginModal from "../../pages/home-page/modal/login-modal";
import InfoModal from "../../pages/home-page/modal/info-modal";
import _var from "../../utils/_var";
import { Link } from "react-router-dom";
import FailAccess from "../fail-access/fail-access";
import Auth from "../auth/auth";

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loginModal: false,
            infoModal: false,
        };
    }

    componentDidMount() {
        this.props.dispatch(UserActions.checkToken());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        this.setState({
            user,
            loginModal: user ? false : this.state.loginModal,
        });
    }

    handleCloseModal = (name) => {
        this.setState({
            [name]: false,
        });
    };

    handleOpenModal = (name) => {
        this.setState({
            [name]: true,
        });
    };

    handleSignOut = () => {
        this.props.dispatch(UserActions.signOut());
    };

    render() {
        const { user, loginModal, infoModal } = this.state;
        const { permission } = this.props;
        return (
            <div className="App" id="header">
                <Menu inverted fluid color="brown" fixed="top">
                    <Menu.Item>
                        <Button inverted icon="home" content="Trang chủ" as={Link} to="/" />
                    </Menu.Item>
                    <Menu.Item>
                        <Button inverted icon="cart" as={Link} to="/shopping-cart" floated="right" />
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            inverted
                            icon="birthday cake"
                            content="Danh sách sản phẩm"
                            as={Link}
                            to="/product"
                            floated="right"
                        />
                    </Menu.Item>
                    {user ? (
                        <Menu.Menu position="right">
                            <Dropdown item text={`Xin chào ${user.fullName}`}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.handleOpenModal("infoModal")}>
                                        Thông tin cá nhân
                                    </Dropdown.Item>
                                    {user.permissionName == _var.permission.admin && (
                                        <Dropdown.Item as={Link} to="/admin-panel">
                                            Quản lý cửa hàng
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item as={Link} to="/export-receipt">
                                        Theo dõi đơn hàng
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={this.handleSignOut}>
                                        <Icon name="sign-out" /> Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    ) : (
                        <Menu.Item position="right">
                            <Button
                                inverted
                                icon="sign-in"
                                content="Đăng nhập"
                                labelPosition="left"
                                onClick={() => this.handleOpenModal("loginModal")}
                            />
                        </Menu.Item>
                    )}
                </Menu>
                <Grid style={{ marginTop: -4 }}>
                    {(user["permissionName"] == permission ||
                    permission == _var.permission.none ||
                    user["permissionName"] == _var.permission.admin) ? (
                        this.props.children
                    ) : (
                        <FailAccess />
                    )}
                    <Button.Group vertical style={{ position: "fixed", right: 10, bottom: "30%" }}>
                        <Button icon="facebook" color="facebook" href="#header" />
                        <Button icon="facebook messenger" color="blue" href="#header" />
                        <Button icon="twitter" color="twitter" href="#header" />
                        <Button icon="instagram" color="instagram" href="#header" />
                        <Button icon="mail" color="red" href="mailto:stungle154@gmail.com" />
                    </Button.Group>
                    <Button.Group vertical style={{ position: "fixed", right: 10, bottom: 10 }}>
                        <Button icon="arrow up" color="yellow" href="#header" />
                    </Button.Group>
                </Grid>
                <LoginModal open={loginModal} onClose={this.handleCloseModal} />
                <InfoModal open={infoModal} onClose={this.handleCloseModal} />
            </div>
        );
    }
}

const mapStateToProps = ({ UserReducer }) => UserReducer;

export default connect(mapStateToProps, null)(Layout);
