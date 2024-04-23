import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const Partners = () => {
    return (
        <div className="partners_container">
            <div className="news_title">Наши клиенты</div>
            <Container className="container-partners_main">

                <Row className="mb-4">
                    <Col xs={6} md={6}><img className="partners_img" src="/client_ecomilk.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_post.png" alt="Partner" /></Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={6} md={6}><img className="partners_img" src="/client_nalchik-mk.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_arnest.png" alt="Partner" /></Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={6} md={6}><img className="partners_img" src="/client_airport-stav.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_molkam.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_nkshina.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_buryatmilk.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_torex.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_oldspring.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_uniconf.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_dimov.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_stavmeat.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_starodvorie.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_belkk.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_fosforel.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_makfa.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_sadpridon.png" alt="Partner" /></Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_ya-mk.png" alt="Partner" /></Col>
                    <Col xs={6} md={6}><img className="partners_img" src="/client_stavvinzavod.png" alt="Partner" /></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Partners
