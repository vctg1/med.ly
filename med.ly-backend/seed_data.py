from datetime import datetime, date, time
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models import Doctor, Exam, DoctorAvailabilitySlot
from app.routers.auth import get_password_hash

def create_seed_data():
    """Popula o banco de dados com dados iniciais"""
    
    # Obter sessão do banco
    db = Session(bind=engine)
    
    try:
        # Limpar dados existentes (opcional)
        db.query(DoctorAvailabilitySlot).delete()
        db.query(Doctor).delete()
        db.query(Exam).delete()
        db.commit()
        
        print("Criando exames...")
        
        # CONSULTAS
        consultas = [
            {"name": "Consulta Cardiológica", "description": "Avaliação e acompanhamento de doenças do coração.", "specialty": "Cardiologia", "image_url": "https://brailecardio.com.br/wp-content/uploads/2019/03/SMT4uK8.jpg"},
            {"name": "Consulta Dermatológica", "description": "Diagnóstico e tratamento de doenças da pele.", "specialty": "Dermatologia", "image_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Pediátrica", "description": "Atendimento médico para crianças e adolescentes.", "specialty": "Pediatria", "image_url": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Ortopédica", "description": "Avaliação de ossos, músculos e articulações.", "specialty": "Ortopedia", "image_url": "https://assets-sitesdigitais.dasa.com.br/strapi/especialid_696c8b10a0/especialid_696c8b10a0.png"},
            {"name": "Consulta Ginecológica", "description": "Saúde da mulher e acompanhamento ginecológico.", "specialty": "Ginecologia", "image_url": "https://drapatriciavarella.com.br/wp-content/uploads/2021/04/O-que-falar-em-uma-consulta-com-ginecologista-min.jpg"},
            {"name": "Consulta Oftalmológica", "description": "Exames e tratamentos para a visão.", "specialty": "Oftalmologia", "image_url": "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Neurológica", "description": "Avaliação de doenças do sistema nervoso.", "specialty": "Neurologia", "image_url": "https://www.dorflex.com.br/dam/jcr:87c4d230-2e52-469a-b52b-204fc219460e/consulta_com_neurologista.webp"},
            {"name": "Consulta Psiquiátrica", "description": "Atendimento para saúde mental e emocional.", "specialty": "Psiquiatria", "image_url": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Endocrinológica", "description": "Tratamento de distúrbios hormonais.", "specialty": "Endocrinologia", "image_url": "https://telemedicinamorsch.com.br/wp-content/uploads/2021/09/consulta-endocrinologista-telemedicina-morsch.jpg"},
            {"name": "Consulta Urológica", "description": "Avaliação do trato urinário e sistema reprodutor masculino.", "specialty": "Urologia", "image_url": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Reumatológica", "description": "Diagnóstico de doenças reumáticas e autoimunes.", "specialty": "Reumatologia", "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Otorrinolaringológica", "description": "Tratamento de ouvidos, nariz e garganta.", "specialty": "Otorrinolaringologia", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuFfOjpYorfxb7DXnlwEvxg5ooMRuiT8o-aQ&s"},
            {"name": "Consulta Gastroenterológica", "description": "Avaliação do sistema digestivo.", "specialty": "Gastroenterologia", "image_url": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Oncológica", "description": "Acompanhamento e tratamento de câncer.", "specialty": "Oncologia", "image_url": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"},
            {"name": "Consulta Nefrológica", "description": "Avaliação e tratamento dos rins.", "specialty": "Nefrologia", "image_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80"},
        ]
        
        # EXAMES
        exames = [
            {"name": "Raio-X de Tórax", "description": "Exame de imagem para avaliação dos pulmões e coração.", "specialty": "Radiologia", "image_url": "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&w=400&q=80"},
            {"name": "Hemograma Completo", "description": "Exame de sangue para avaliação geral da saúde.", "specialty": "Laboratório", "image_url": "https://lirp.cdn-website.com/57372278/dms3rep/multi/opt/blog047-640w.jpg"},
            {"name": "Ultrassonografia Abdominal", "description": "Exame de imagem para órgãos abdominais.", "specialty": "Ultrassonografia", "image_url": "https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg"},
            {"name": "Endoscopia Digestiva", "description": "Exame para avaliação do trato digestivo superior.", "specialty": "Endoscopia", "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"},
            {"name": "Eletrocardiograma", "description": "Exame para avaliação da atividade elétrica do coração.", "specialty": "Cardiologia Diagnóstica", "image_url": "https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg"},
            {"name": "Ressonância Magnética Cerebral", "description": "Exame de imagem detalhado do cérebro.", "specialty": "Neurologia Diagnóstica", "image_url": "https://i0.wp.com/teslaimagem.com.br/wp-content/uploads/2017/10/ressonancia-magnetica-de-cranio.jpg?fit=4928%2C3264&ssl=1"},
            {"name": "Mapeamento de Retina", "description": "Exame para avaliação detalhada da retina.", "specialty": "Oftalmologia Diagnóstica", "image_url": "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80"},
            {"name": "Colposcopia", "description": "Exame para avaliação do colo do útero.", "specialty": "Ginecologia Diagnóstica", "image_url": "https://cedusp.com.br/wp-content/uploads/2024/11/colposcopia-scaled.jpg"},
            {"name": "Urofluxometria", "description": "Exame para avaliação do fluxo urinário.", "specialty": "Urologia Diagnóstica", "image_url": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80"},
            {"name": "Biópsia de Pele", "description": "Exame para análise de lesões cutâneas.", "specialty": "Dermatologia Diagnóstica", "image_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80"},
        ]
        
        # Criar consultas
        exam_objects = {}
        for consulta in consultas:
            exam = Exam(
                name=consulta["name"],
                exam_type="consulta",
                duration_minutes=45,
                description=consulta["description"],
                image_url=consulta["image_url"],
                specialty=consulta["specialty"]
            )
            db.add(exam)
            exam_objects[consulta["specialty"]] = exam
        
        # Criar exames
        for exame in exames:
            exam = Exam(
                name=exame["name"],
                exam_type="exame",
                duration_minutes=30,
                description=exame["description"],
                image_url=exame["image_url"],
                specialty=exame["specialty"]
            )
            db.add(exam)
            exam_objects[exame["specialty"]] = exam
        
        db.commit()
        print(f"Criados {len(consultas) + len(exames)} exames")
        
        print("Criando médicos...")
        
        # MÉDICOS
        doctors_data = [
            {"nome": "Dr. Paulo Amaral", "area": "Radiologia", "horarios": ["08:00", "10:00", "14:00"]},
            {"nome": "Dra. Renata Lopes", "area": "Laboratório", "horarios": ["09:00", "11:00", "15:00"]},
            {"nome": "Dr. Sérgio Tavares", "area": "Ultrassonografia", "horarios": ["08:30", "13:00", "16:00"]},
            {"nome": "Dra. Tânia Borges", "area": "Endoscopia", "horarios": ["09:30", "12:00", "17:00"]},
            {"nome": "Dr. Vinícius Prado", "area": "Cardiologia Diagnóstica", "horarios": ["10:00", "13:00", "15:30"]},
            {"nome": "Dra. Wanda Silva", "area": "Neurologia Diagnóstica", "horarios": ["08:00", "11:00", "16:00"]},
            {"nome": "Dr. Xavier Ramos", "area": "Oftalmologia Diagnóstica", "horarios": ["09:00", "12:00", "18:00"]},
            {"nome": "Dra. Yara Fernandes", "area": "Ginecologia Diagnóstica", "horarios": ["08:30", "14:00", "17:30"]},
            {"nome": "Dr. Zeca Moura", "area": "Urologia Diagnóstica", "horarios": ["10:00", "13:30", "16:30"]},
            {"nome": "Dra. Beatriz Cunha", "area": "Dermatologia Diagnóstica", "horarios": ["09:30", "12:30", "15:30"]},
            {"nome": "Dra. Ana Souza", "area": "Cardiologia", "horarios": ["09:00", "10:00", "11:00"]},
            {"nome": "Dr. Bruno Lima", "area": "Dermatologia", "horarios": ["13:00", "14:00", "15:00"]},
            {"nome": "Dra. Carla Mendes", "area": "Pediatria", "horarios": ["08:00", "09:30", "11:30"]},
            {"nome": "Dr. Daniel Rocha", "area": "Ortopedia", "horarios": ["10:00", "12:00", "16:00"]},
            {"nome": "Dra. Elisa Martins", "area": "Ginecologia", "horarios": ["09:00", "13:00", "17:00"]},
            {"nome": "Dr. Felipe Torres", "area": "Oftalmologia", "horarios": ["08:30", "10:30", "14:30"]},
            {"nome": "Dra. Gabriela Silva", "area": "Neurologia", "horarios": ["09:00", "11:00", "15:00"]},
            {"nome": "Dr. Henrique Alves", "area": "Psiquiatria", "horarios": ["10:00", "13:00", "16:00"]},
            {"nome": "Dra. Isabela Castro", "area": "Endocrinologia", "horarios": ["08:00", "12:00", "15:30"]},
            {"nome": "Dr. João Pereira", "area": "Urologia", "horarios": ["09:30", "11:30", "14:30"]},
            {"nome": "Dra. Karina Duarte", "area": "Reumatologia", "horarios": ["10:00", "12:30", "16:30"]},
            {"nome": "Dr. Lucas Barros", "area": "Otorrinolaringologia", "horarios": ["08:30", "13:30", "17:30"]},
            {"nome": "Dra. Mariana Figueiredo", "area": "Gastroenterologia", "horarios": ["09:00", "11:30", "15:30"]},
            {"nome": "Dr. Nelson Prado", "area": "Oncologia", "horarios": ["10:00", "14:00", "16:00"]},
            {"nome": "Dra. Olivia Ramos", "area": "Nefrologia", "horarios": ["08:00", "12:00", "18:00"]},
        ]
        
        doctor_objects = []
        for i, doctor_data in enumerate(doctors_data, 1):
            # Gerar dados fictícios para o médico
            full_name = doctor_data["nome"]
            first_name = full_name.split()[0]
            middle_name = " ".join(full_name.split()[1:-1]) if len(full_name.split()) > 2 else ""
            last_name = full_name.split()[-1]
            # Gerar email e CRM fictícios
            email = f"{first_name.lower()}{middle_name.lower()}.{last_name.lower()}@medlydoctors.com"
            crm = f"CRM{str(i).zfill(5)}"
            
            doctor = Doctor(
                full_name=full_name,
                email=email,
                crm_number=crm,
                specialty=doctor_data["area"],
                state="SP",
                password_hash=get_password_hash("123456"),  # Senha padrão para todos
                city="São Paulo",
                cep="01000-000",
                number="123",
                complement="Sala " + str(i),
                neighborhood="Centro",
                is_currently_active=True,
                current_score=5.0
            )
            db.add(doctor)
            doctor_objects.append((doctor, doctor_data))
        
        db.commit()
        print(f"Criados {len(doctors_data)} médicos")
        
        print("Criando slots de disponibilidade...")
        
        # SLOTS DE DISPONIBILIDADE
        datas = [date(2025, 6, 23), date(2025, 6, 24), date(2025, 6, 25)]
        
        slots_count = 0
        for doctor, doctor_data in doctor_objects:
            # Buscar o exame correspondente à especialidade do médico
            exam = exam_objects.get(doctor_data["area"])
            if not exam:
                print(f"Exame não encontrado para a área: {doctor_data['area']}")
                continue
            
            for data in datas:
                for horario in doctor_data["horarios"]:
                    start_time = time.fromisoformat(horario)
                    # Adicionar duração do exame para calcular end_time
                    end_hour = start_time.hour
                    end_minute = start_time.minute + exam.duration_minutes
                    if end_minute >= 60:
                        end_hour += end_minute // 60
                        end_minute = end_minute % 60
                    
                    end_time = time(end_hour, end_minute)
                    
                    slot = DoctorAvailabilitySlot(
                        doctor_id=doctor.id,
                        exam_id=exam.id,
                        date=data,
                        start_time=start_time,
                        end_time=end_time,
                        is_available=True,
                        created_at=datetime.utcnow()
                    )
                    db.add(slot)
                    slots_count += 1
        
        db.commit()
        print(f"Criados {slots_count} slots de disponibilidade")
        print("Seed concluído com sucesso!")
        
    except Exception as e:
        print(f"Erro durante o seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()