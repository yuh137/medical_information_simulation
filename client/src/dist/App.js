"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var initIDB_1 = require("./utils/indexedDB/initIDB");
var Login_1 = require("./pages/Login");
var Register_1 = require("./pages/Register");
var Unauthorized_1 = require("./pages/Unauthorized");
var StudentHomeScreen_1 = require("./pages/StudentView/StudentHomeScreen");
var StudentQualityControls_1 = require("./pages/StudentView/StudentQualityControls");
var OrderControls_1 = require("./pages/StudentView/OrderControls");
var QC_Results_1 = require("./pages/QC_Results");
var AuthContext_1 = require("./context/AuthContext");
var FacultyHomeScreen_1 = require("./pages/FacultyView/FacultyHomeScreen");
var FacultyQualityControls_1 = require("./pages/FacultyView/FacultyQualityControls");
var QCBuilderPage_1 = require("./pages/QCBuilderPage");
var EditQCPage_1 = require("./pages/EditQCPage");
var TestInputPage_1 = require("./pages/TestInputPage");
var ErrorPage_1 = require("./pages/ErrorPage");
var ResultsInProgress_1 = require("./pages/ResultsInProgress");
var CustomQCBuild_1 = require("./pages/CustomQCBuild");
var CustomTests_1 = require("./pages/CustomTests");
var StudentReviewControls_1 = require("./pages/StudentView/StudentReviewControls");
var QCTypeSelection_1 = require("./pages/QCTypeSelection");
var Layout_1 = require("./utils/Layout");
var LeveyJennings_1 = require("./pages/LeveyJennings");
var SimpleAnalyteInputPage_1 = require("./pages/SimpleAnalyteInputPage");
var utils_1 = require("./utils/utils");
var Simple_Faculty_Review_Controls_1 = require("./pages/StudentView/Simple_Faculty_Review_Controls");
function App() {
    initIDB_1["default"]();
    var _a = AuthContext_1.useAuth(), checkSession = _a.checkSession, checkUserType = _a.checkUserType;
    var router = react_router_dom_1.createBrowserRouter([
        {
            path: '/',
            element: react_1["default"].createElement(Layout_1["default"], null),
            children: __spreadArrays([
                {
                    index: true,
                    element: checkSession() ? react_1["default"].createElement(react_router_dom_1.Navigate, { to: "/home" }) : react_1["default"].createElement(react_router_dom_1.Navigate, { to: "/login" })
                },
                { path: 'login', element: react_1["default"].createElement(Login_1["default"], null) },
                { path: 'register', element: react_1["default"].createElement(Register_1["default"], null) },
                {
                    path: 'home',
                    element: checkUserType() === 'student' ? react_1["default"].createElement(StudentHomeScreen_1["default"], null) : react_1["default"].createElement(FacultyHomeScreen_1["default"], null)
                },
                {
                    path: 'qc',
                    element: checkUserType() === 'student' ? react_1["default"].createElement(StudentQualityControls_1["default"], null) : react_1["default"].createElement(FacultyQualityControls_1["default"], null)
                },
                {
                    path: 'review_controls',
                    element: checkUserType() === 'student' ? react_1["default"].createElement(StudentReviewControls_1["default"], { name: "Student", link: "student" }) : react_1["default"].createElement(Simple_Faculty_Review_Controls_1["default"], { name: "Faculty", link: "faculty" })
                },
                {
                    path: 'levey-jennings/:fileName/:lotNumber/:analyteName',
                    element: react_1["default"].createElement(LeveyJennings_1["default"], null)
                },
                { path: 'results', element: react_1["default"].createElement(ResultsInProgress_1["default"], null) },
                { path: 'order_controls', element: react_1["default"].createElement(OrderControls_1["default"], null) },
                {
                    path: '/simple-analyte-input-page',
                    element: react_1["default"].createElement(SimpleAnalyteInputPage_1["default"], { name: "Some Name" })
                }
            ], utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/qc_results",
                children: [
                    {
                        index: true,
                        element: react_1["default"].createElement(QC_Results_1["default"], { link: item.link, name: item.name })
                    },
                ]
            }); }), utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/qc_builder",
                element: react_1["default"].createElement(QCBuilderPage_1["default"], { link: item.link, name: item.name })
            }); }), utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/edit_qc",
                children: __spreadArrays([
                    {
                        index: true,
                        element: react_1["default"].createElement(EditQCPage_1["default"], { link: item.link, name: item.name })
                    }
                ], utils_1.qcTypeLinkList.map(function (subItem) { return ({
                    path: subItem.link,
                    element: (react_1["default"].createElement(TestInputPage_1.TestInputPage, { name: subItem.name, link: subItem.link, dataType: subItem.name.includes('Cardiac')
                            ? 'Cardiac'
                            : subItem.name.includes('Lipid')
                                ? 'Lipid'
                                : subItem.name.includes('Liver')
                                    ? 'Liver'
                                    : subItem.name.includes('Thyroid')
                                        ? 'Thyroid'
                                        : subItem.name.includes('Iron')
                                            ? 'Iron'
                                            : subItem.name.includes('Drug')
                                                ? 'Drug'
                                                : subItem.name.includes('Hormone')
                                                    ? 'Hormone'
                                                    : subItem.name.includes('Pancreatic')
                                                        ? 'Pancreatic'
                                                        : subItem.name.includes('Vitamins')
                                                            ? 'Vitamins'
                                                            : subItem.name.includes('Diabetes')
                                                                ? 'Diabetes'
                                                                : subItem.name.includes('Cancer')
                                                                    ? 'Cancer'
                                                                    : 'General' }))
                }); }))
            }); }), utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/build_qc/:type",
                element: react_1["default"].createElement(CustomQCBuild_1["default"], { name: item.name, link: "" })
            }); }), utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/custom_tests",
                element: react_1["default"].createElement(CustomTests_1["default"], { name: item.name + " Custom Tests" })
            }); }), utils_1.testTypeLinkList.map(function (item) { return ({
                path: item.link + "/qc_types",
                element: react_1["default"].createElement(QCTypeSelection_1["default"], { name: item.name, link: item.link })
            }); }), [
                { path: 'unauthorized', element: react_1["default"].createElement(Unauthorized_1["default"], null) },
                { path: '*', element: react_1["default"].createElement(ErrorPage_1["default"], null) },
            ])
        },
    ]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_router_dom_1.RouterProvider, { router: router })));
}
exports["default"] = App;
