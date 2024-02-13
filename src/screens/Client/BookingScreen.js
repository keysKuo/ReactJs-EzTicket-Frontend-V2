import { useEffect, useState } from 'react';
import { Banner } from '../../components/Client';
import { Link, useParams } from 'react-router-dom';
import TicketList from '../../components/Client/TicketList';
import CustomerInfo from '../../components/Client/CustomerInfo';
import { BiCreditCard, BiLogoPaypal, BiLogoAmazon } from 'react-icons/bi';
import axios from 'axios';
import { Toast, Spinner } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';


export default function BookingScreen() {
    const [user, setUser] = useState(() => {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    });

    const [paymentActive, setPaymentActive] = useState('stripe');
    const [formData, setFormData] = useState({
        items: [],
        temporary_cost: 0,
        payment_type: paymentActive,
    });
    const [checkoutStage, setCheckoutStage] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);

    const { event_slug } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }

        // console.log(user)

        const fetchDataEvent = async () => {
            const options = {
                url: `${process.env.REACT_APP_API_URL}/api/event/view/${event_slug}`,
                method: 'GET',
            };

            await axios
                .request(options)
                .then((response) => {
                    const result = response.data;

                    if (result.success) {
                        console.log(result.event);
                        setEvent({ ...result.event });
                    }

                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchDataEvent();
    }, []);

    const handleStage1 = () => {
        setIsCreatingBooking(true);
        const createBooking = async () => {
            const options = {
                url: `${process.env.REACT_APP_API_URL}/api/booking/create`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {},
                data: JSON.stringify({ ...formData, customer: user }),
            };

            await axios
                .request(options)
                .then((response) => {
                    const result = response.data;
                    window.location.href = `/event/${event_slug}/booking/${result.booking_id}/checkout`
                    
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        setErrorMessage(err.response.data.msg);
                    }, 1000);
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsCreatingBooking(false);
                    }, 1000);
                });
        };

        createBooking();
    };

    const handleCancelBooking = () => {};

    return (
        <>
            {event && (
                <section className="mt-[6.5rem] min-h-screen">
                    <Banner event={event} />

                    <div className="booking-container w-[65%] mx-auto">
                        <div className="grid grid-cols-6 gap-4 my-5">
                            {/* Stage 1 */}
                            <>
                                <div className="desktop:col-span-4 laptop:col-span-3 col-span-6 bg-zinc-800 p-4 self-start">
                                    <div className="flex flex-col gap-4">
                                        <TicketList
                                            time={`${event.time} ${new Date(event.occur_date).toLocaleDateString(
                                                'vi-vn',
                                            )}`}
                                            ticket_types={event.ticket_types}
                                            qty={true}
                                            data={formData}
                                            setData={setFormData}
                                        />
                                        <div className="w-[100%]">
                                            <div className="border-b border-emerald-300 ">
                                                <div className="text-md font-medium text-emerald-300 py-2">
                                                    Phương thức thanh toán
                                                </div>
                                            </div>
                                            <div className="py-2"></div>
                                            <div className="grid grid-cols-3 gap-5 p-4">
                                                <div className="col-span-1">
                                                    <div
                                                        className={`rounded-md flex flex-col items-center justify-center w-full
                                                            border-2 border-${
                                                                paymentActive === 'stripe' ? 'emerald' : 'slate'
                                                            }-300 py-6 gap-2
                                                            hover:border-emerald-300 hover:opacity-90 cursor-pointer`}
                                                        onClick={() => {
                                                            setPaymentActive('stripe');
                                                            setFormData({ ...formData, payment_type: 'stripe' });
                                                        }}
                                                    >
                                                        <BiCreditCard size={40} />
                                                        <p className="desktop:block hidden text-sm font-medium">
                                                            Thanh toán với thẻ Visa
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-span-1">
                                                    <div
                                                        className={`rounded-md flex flex-col items-center justify-center w-full 
                                                            border-2 border-${
                                                                paymentActive === 'paypal' ? 'emerald' : 'slate'
                                                            }-300 py-6 gap-2
                                                            hover:border-emerald-300 hover:opacity-90 cursor-pointer `}
                                                        onClick={() => {
                                                            setPaymentActive('paypal');
                                                            setFormData({ ...formData, payment_type: 'paypal' });
                                                        }}
                                                    >
                                                        <BiLogoPaypal size={40} />
                                                        <p className="desktop:block hidden text-sm font-medium">
                                                            Thanh toán với Paypal
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-span-1">
                                                    <div
                                                        className={`rounded-md flex flex-col items-center justify-center w-full 
                                                            border-2 border-${
                                                                paymentActive === 'amazon' ? 'emerald' : 'slate'
                                                            }-300 py-6 gap-2
                                                            hover:border-emerald-300 hover:opacity-90 cursor-pointer `}
                                                        onClick={() => {
                                                            setPaymentActive('amazon');
                                                            setFormData({ ...formData, payment_type: 'amazon' });
                                                        }}
                                                    >
                                                        <BiLogoAmazon size={40} />
                                                        <p className="desktop:block hidden text-sm font-medium">
                                                            Thanh toán với Amazon
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>

                            

                            <div className="relative desktop:col-span-2 laptop:col-span-3 col-span-6 w-[100%]">
                                <div className="w-[100%] px-4 py-4 bg-zinc-800">
                                    <div className="w-[100%] pb-3">
                                        <CustomerInfo user={user} />
                                    </div>

                                    <div className="border-b border-emerald-300 flex items-center justify-between">
                                        <div className="text-md font-medium text-emerald-300 py-2">
                                            Thông tin đặt vé
                                        </div>
                                       
                                    </div>

                                    <div className="py-2 border-b border-dashed mt-1 border-gray-300">
                                        {formData.items.length === 0 ? (
                                            <>-</>
                                        ) : (
                                            <>
                                                {formData.items.map((tp, index) => {
                                                    return (
                                                        <>
                                                            <table key={index} className="table w-[100%]">
                                                                <tbody>
                                                                    <tr className="table-row">
                                                                        <td className="text-sm font-base p-1">
                                                                            {tp.ticket_name} <br />{' '}
                                                                            {tp.price.toLocaleString('vi-vn')}đ
                                                                        </td>
                                                                        <td className="text-sm text-right">
                                                                            {tp.qty} <br />{' '}
                                                                            {(tp.price * tp.qty).toLocaleString(
                                                                                'vi-vn',
                                                                            )}
                                                                            đ
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 font-medium text-slate-700 px-4 h-12 flex flex-row items-center justify-between ">
                                    <span className="text-sm">Tạm tính</span>
                                    <span className="text-sm">{formData.temporary_cost.toLocaleString('vi-vn')}đ</span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (formData.items.length === 0) {
                                            setErrorMessage('Vui lòng chọn vé trước khi thanh toán');
                                            return;
                                        }

                                        setErrorMessage('');
                                        handleStage1();
                                    }}
                                    className="absolute bg-main py-3 text-center rounded w-[100%] mt-5"
                                >
                                    {isCreatingBooking ? <Spinner color='success' /> : 'Tiếp tục'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className={`fixed right-3 bottom-5 ${errorMessage !== '' ? 'block' : 'hidden'}`}>
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                        <HiExclamation className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-xs font-normal">{errorMessage}</div>
                    {/* <Toast.Toggle /> */}
                </Toast>
            </div>
        </>
    );
}
